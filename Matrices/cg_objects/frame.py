"""Provides a coordinate frame type"""
import numpy as np
from . import cg_base, transformations

__all__ = ['Frame']


class Frame(transformations.GlobalTransformations):
    __slots__ = '__local', '__x', '__y', '__z', '__origin'

    @classmethod
    def from_array(cls, array):
        if array.shape == (4, 4) and (array[3] == [0, 0, 0, 1]).all():
            return cls(*map(
                super().from_array,
                array.T
            ))

    def __new__(
        cls, x: cg_base.Vector, y: cg_base.Vector, z: cg_base.Vector,
        origin: cg_base.Point
    ):
        self = super().__new__(cls)
        self.__local = LocalFrame(x, y, z, origin)
        return self

    def __init__(
        self, x: cg_base.Vector, y: cg_base.Vector, z: cg_base.Vector,
        origin: cg_base.Point
    ):
        self.__x = x
        self.__y = y
        self.__z = z
        self.__origin = origin
        self.matrix = np.array([x.matrix, y.matrix, z.matrix, origin.matrix]).T

    @property
    def local(self):
        """The Frame object whose transformation methods are performed with
        respect to the frame"""
        return self.__local

    @property
    def x(self):
        """The frame's x axis"""
        return self.__x

    @property
    def y(self):
        """The frame's y axis"""
        return self.__y

    @property
    def z(self):
        """The frame's z axis"""
        return self.__z

    @property
    def origin(self):
        """The frame's origin"""
        return self.__origin

    def inv(self):
        """Calculate the inverse of a matrix"""
        return cg_base.CgBase.from_array(np.linalg.inv(self.matrix))


class LocalFrame(transformations.LocalTransformations, Frame):
    __slots__ = ()

    def __new__(
        cls, x: cg_base.Vector, y: cg_base.Vector, z: cg_base.Vector,
        origin: cg_base.Point
    ):
        return object.__new__(cls)


def _init_frame(cls):
    cls.unit = cls(
        cg_base.Vector.i_hat, cg_base.Vector.j_hat, cg_base.Vector.k_hat,
        cg_base.Point.origin)
    return cls


Frame = _init_frame(Frame)
