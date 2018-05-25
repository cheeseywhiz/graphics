"""Mixin classes providing operations for CgBase objects"""
import functools
import math
import numpy as np
from . import cg_base, fundamental

__all__ = ['FrameLocalOps', 'GlobalOps', 'BaseOperations']


class OperationsMeta(cg_base.CgMeta):
    def __init__(self, name, bases, namespace):
        self.Globals = self.decorate_type_attrs(
            'Globals', bases, namespace, self.apply_global_matrix)
        self.Locals = self.decorate_type_attrs(
            'Locals', bases, namespace, self.apply_local_matrix)

    def decorate_type_attrs(self, name, bases, namespace, decorator):
        name = '.'.join((self.__name__, name))
        new_namespace = namespace.copy()
        new_namespace.update({
            name_: decorator(value)
            for name_, value in namespace.items()
            if not name_.startswith('_')})
        new_namespace['__qualname__'] = name
        return type(name, bases, new_namespace)

    @staticmethod
    def apply_global_matrix(function):
        @functools.wraps(function)
        def wrapped(cg_object, *args, **kwargs):
            operation_matrix = function(cg_object, *args, **kwargs)
            # use the method that cg_object inherited
            operation = super(type(cg_object), cg_object).from_array(
                np.array(operation_matrix))
            return operation @ cg_object

        return wrapped

    @staticmethod
    def apply_local_matrix(function):
        @functools.wraps(function)
        def wrapped(cg_object, *args, **kwargs):
            operation_matrix = function(cg_object, *args, **kwargs)
            # use the method that cg_object inherited
            operation = super(type(cg_object), cg_object).from_array(
                np.array(operation_matrix))
            return cg_object @ operation

        return wrapped


class BaseOperations(cg_base.CgBase, metaclass=OperationsMeta):
    __slots__ = ()

    def scale(self, x, y=..., z=1):
        """Scale the object with respect to the origin"""
        if y is ...:
            z = y = x

        return [[x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]]

    def translate(self, operand):
        """Translate the object with respect to a vector"""
        return [[1, 0, 0, operand.i],
                [0, 1, 0, operand.j],
                [0, 0, 1, operand.k],
                [0, 0, 0, 1]]

    def rotate_x(self, angle):
        """Rotate the object around the x axis"""
        return [[1, 0, 0, 0],
                [0, math.cos(angle), -math.sin(angle), 0],
                [0, math.sin(angle), math.cos(angle), 0],
                [0, 0, 0, 1]]

    def rotate_y(self, angle):
        """Rotate the object around the y axis"""
        return [[math.cos(angle), 0, math.sin(angle), 0],
                [0, 1, 0, 0],
                [-math.sin(angle), 0, math.cos(angle), 0],
                [0, 0, 0, 1]]

    def rotate_z(self, angle):
        """Rotate the object around the z axis"""
        return [[math.cos(angle), -math.sin(angle), 0, 0],
                [math.sin(angle), math.cos(angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]]


class GlobalOps(BaseOperations.Globals):
    __slots__ = ()

    def scale_center(self, x, y=..., z=1, center=None):
        """Scale the object with respect to a center of magnification"""
        if center is None:
            to_center = fundamental.Vector.zero
        else:
            to_center = fundamental.Point.origin - center

        return super() \
            .translate(to_center) \
            .scale(x, y, z) \
            .translate(-to_center)

    def rotate_frame(self, angle, frame=None):
        """Rotate the object around the z axis of a frame."""
        if frame is None:
            frame = fundamental.Frame.unit

        # represent self in terms of the frame
        new_self = frame.inv() @ self
        # then rotate the frame and reevaluate new_self
        return frame.local.rotate_z(angle) @ new_self

    def rotate_axis(self, angle, axis=None, through=None):
        """Rotate the object around an axis that is parallel to a vector and
        passes through a point"""
        if axis is None:
            axis = fundamental.Vector.k_hat

        if through is None:
            through = fundamental.Point.origin

        axis_frame = fundamental.Frame.from_z_axis(axis, through)

        if isinstance(self, fundamental.LocalFrame):
            # use the method that Frame inherited
            rotate_frame = super(fundamental.Frame, self).rotate_frame
        else:
            rotate_frame = self.rotate_frame

        return rotate_frame(angle, axis_frame)


class FrameLocalOps(BaseOperations.Locals, GlobalOps):
    __slots__ = ()

    def scale_center(self, x, y=..., z=1, center=None):
        if center is None:
            center = fundamental.Point.origin

        center = self @ center
        return super().scale_center(x, y, z, center)

    def rotate_frame(self, angle, other=None):
        if other is None:
            other = fundamental.Frame.unit

        other = self @ other
        return super().rotate_frame(angle, other)

    def rotate_axis(self, angle, axis=None, through=None):
        if axis is None:
            axis = fundamental.Vector.k_hat

        if through is None:
            through = fundamental.Point.origin

        axis = self @ axis
        through = self @ through
        return super().rotate_axis(angle, axis, through)
