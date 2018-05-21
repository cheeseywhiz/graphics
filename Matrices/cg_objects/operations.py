"""Mixin classes for Frame types"""
import functools
import math
import numpy as np
from . import cg_base, frame

__all__ = ['StandardOperations', 'LocalOperations', 'GlobalOperations']


class StandardMeta(cg_base.CgMeta):
    def __init__(self, name, bases, namespace):
        self.Globals = self.decorate_type_attrs(
            'Globals', bases, namespace, self.apply_global_matrix)
        self.Locals = self.decorate_type_attrs(
            'Locals', bases, namespace, self.apply_local_matrix)

    def decorate_type_attrs(self, name, bases, namespace, decorator):
        new_namespace = namespace.copy()
        new_namespace.update({
            name_: decorator(value)
            for name_, value in namespace.items()
            if not name_.startswith('_')})
        new_namespace['__qualname__'] = '.'.join((self.__name__, name))
        return type(name, bases, new_namespace)

    @staticmethod
    def apply_global_matrix(function):
        @functools.wraps(function)
        def wrapped(frame, *args, **kwargs):
            operation_matrix = function(frame, *args, **kwargs)
            operation = cg_base.CgBase.from_array(
                np.array(operation_matrix))
            return operation @ frame

        return wrapped

    @staticmethod
    def apply_local_matrix(function):
        @functools.wraps(function)
        def wrapped(frame, *args, **kwargs):
            operation_matrix = function(frame, *args, **kwargs)
            operation = cg_base.CgBase.from_array(
                np.array(operation_matrix))
            return frame @ operation

        return wrapped


class StandardOperations(cg_base.CgBase, metaclass=StandardMeta):
    __slots__ = ()

    def scale(self, x, y=..., z=1):
        """Scale the frame with respect to the origin"""
        if y is ...:
            z = y = x

        return [[x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]]

    def translate(self, other: cg_base.Vector):
        """Translate the frame with respect to a vector"""
        return np.array([[1, 0, 0, 0],
                         [0, 1, 0, 0],
                         [0, 0, 1, 0],
                         (cg_base.Point(0, 0, 0) + other).matrix]).T

    def rotate_x(self, angle):
        """Rotate around the x axis"""
        return [[1, 0, 0, 0],
                [0, math.cos(angle), -math.sin(angle), 0],
                [0, math.sin(angle), math.cos(angle), 0],
                [0, 0, 0, 1]]

    def rotate_y(self, angle):
        """Rotate around the y axis"""
        return [[math.cos(angle), 0, math.sin(angle), 0],
                [0, 1, 0, 0],
                [-math.sin(angle), 0, math.cos(angle), 0],
                [0, 0, 0, 1]]

    def rotate_z(self, angle):
        """Rotate around the z axis"""
        return [[math.cos(angle), -math.sin(angle), 0, 0],
                [math.sin(angle), math.cos(angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]]


class GlobalOperations(StandardOperations.Globals):
    __slots__ = ()

    def scale_center(self, x, y=..., z=1, center: cg_base.Point=None):
        """Scale the frame with respect to a center of magnification"""
        if center is None:
            center = self.origin

        translation = cg_base.Point.origin - center

        return super() \
            .translate(translation) \
            .scale(x, y, z) \
            .translate(-translation)

    def rotate_axis(
            self, angle, axis: cg_base.Vector=None, through: cg_base.Point=None
    ):
        """Rotate the frame around an axis that is parallel to a vector and
        passes through a point"""
        if axis is None:
            axis = cg_base.Vector.k_hat

        if through is None:
            through = cg_base.Point.origin

        theta = cg_base.Vector.k_hat.angle(axis)
        xy_projection = cg_base.Vector(axis.i, axis.j, 0)

        if xy_projection:
            phi = cg_base.Vector.i_hat.angle(xy_projection)
        else:
            phi = 0

        # axis_frame's z axis is parallel to the specified axis and its origin
        # is the specified point
        axis_frame = frame.Frame.unit \
            .rotate_y(theta) \
            .rotate_z(phi) \
            .translate(through - cg_base.Point.origin)

        # represent self in terms of axis_frame
        new_frame = axis_frame.inv() @ self
        # then rotate axis_frame and reevaluate new_frame
        return axis_frame.local.rotate_z(angle) @ new_frame


class LocalOperations(StandardOperations.Locals, GlobalOperations):
    __slots__ = ()

    def scale_center(self, x, y=..., z=1, center: cg_base.Point=None):
        if center is None:
            center = cg_base.Point.origin

        center = self @ center
        return super().scale_center(x, y, z, center)

    def rotate_axis(
        self, angle, axis: cg_base.Vector=None, through: cg_base.Point=None
    ):
        if axis is None:
            axis = cg_base.Vector.k_hat

        if through is None:
            through = cg_base.Point.origin

        axis = self @ axis
        through = self @ through
        return super().rotate_axis(angle, axis, through)
