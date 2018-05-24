"""Mixin classes providing operations for Frame types"""
from . import cg_base, fundamental

__all__ = ['FrameLocalOps', 'FrameGlobalOps']


class FrameGlobalOps(cg_base.StandardOperations.Globals):
    __slots__ = ()

    def scale_center(self, x, y=..., z=1, center=None):
        """Scale the frame with respect to a center of magnification"""
        if center is None:
            center = self.origin

        translation = fundamental.Point.origin - center

        return super() \
            .translate(translation) \
            .scale(x, y, z) \
            .translate(-translation)

    def rotate_frame(self, angle, other=None):
        """Rotate the frame around the z axis of another frame."""
        if other is None:
            other = fundamental.Frame.unit

        # represent self in terms of the other frame
        new_frame = other.inv() @ self
        # then rotate the other frame and reevaluate new_frame
        return other.local.rotate_z(angle) @ new_frame

    def rotate_axis(self, angle, axis=None, through=None):
        if axis is None:
            axis = fundamental.Vector.k_hat

        if through is None:
            through = fundamental.Point.origin

        """Rotate the frame around an axis that is parallel to a vector and
        passes through a point"""
        axis_frame = fundamental.Frame.from_z_axis(axis, through)
        return self._global.rotate_frame(angle, axis_frame)


class FrameLocalOps(cg_base.StandardOperations.Locals, FrameGlobalOps):
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
