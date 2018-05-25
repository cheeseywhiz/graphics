"""Fundamental matrix math types"""
import math
import numpy as np
from . import cg_base, operations

__all__ = ['Point', 'Vertices', 'Vector', 'Frame']


def _init_point(cls):
    cls.origin = cls(0, 0, 0)
    return cls


@_init_point
class Point(operations.GlobalOps):
    __slots__ = '__x', '__y', '__z'

    @classmethod
    def from_array(cls, array):
        if array.shape == (4, ) and array[3] == 1:
            return cls(*array[:3])

    def __init__(self, x, y, z):
        super().__init__(np.array([x, y, z, 1]))
        self._args = x, y, z
        self.__x = x
        self.__y = y
        self.__z = z

    @property
    def x(self):
        """The point's x component"""
        return self.__x

    @property
    def y(self):
        """The point's y component"""
        return self.__y

    @property
    def z(self):
        """The point's z component"""
        return self.__z

    def __add__(self, other):
        """Point + Vector = Point"""
        if isinstance(other, Point):
            raise TypeError(
                f'Cannot add {type(other).__name__} to {type(self).__name__}')

        return cg_base.CgBase.from_array(np.array(self) + np.array(other))

    def __sub__(self, other):
        """Tail - Head = Vector from Head to Tail"""
        if isinstance(other, Vector):
            raise TypeError(
                f'Cannot subtract {type(other).__name__} from '
                f'{type(self).__name__}')

        return cg_base.CgBase.from_array(np.array(self) - np.array(other))

    @property
    def spherical(self):
        """The spherical coordinates representation of the point.
        Returns radius, theta, phi"""
        return (self - self.origin).spherical


class Vertices(operations.GlobalOps):
    __slots__ = ()

    @classmethod
    def from_array(cls, array):
        if array.ndim == 2 and array.shape[0] == 4 and (array[3] == 1).all():
            return cls(*(  # why does super needs arguments here?
                super(Vertices, cls).from_array(tup)
                for tup in array.T
            ))

    def __init__(self, *points):
        super().__init__(np.array(list(map(np.array, points))).T)
        self._args = points

    def __getitem__(self, index):
        array = np.array(self).T[index]

        if isinstance(index, slice):
            array = array.T

        return cg_base.CgBase.from_array(array)


def _init_vector(cls):
    cls.i_hat = cls(1, 0, 0)
    cls.j_hat = cls(0, 1, 0)
    cls.k_hat = cls(0, 0, 1)
    cls.zero = cls(0, 0, 0)
    return cls


@_init_vector
class Vector(operations.GlobalOps):
    __slots__ = '__i', '__j', '__k'

    @classmethod
    def from_array(cls, array):
        if array.shape == (4, ) and array[3] == 0:
            return cls(*array[:3])

    def __init__(self, i, j, k):
        super().__init__(np.array([i, j, k, 0]))
        self._args = i, j, k
        self.__i = i
        self.__j = j
        self.__k = k

    @property
    def i(self):
        """The vector's i component"""
        return self.__i

    @property
    def j(self):
        """The vector's j component"""
        return self.__j

    @property
    def k(self):
        """The vector's k component"""
        return self.__k

    def __bool__(self):
        """False if zero vector else True"""
        return bool(np.array(self).any())

    def __add__(self, other):
        """Vector + Vector = Vector
        Vector + Point = Point"""
        return cg_base.CgBase.from_array(np.array(self) + np.array(other))

    def __mul__(self, scalar):
        """Vector * Scalar = Vector"""
        if isinstance(scalar, cg_base.CgBase):
            raise TypeError(
                f'Cannot multiply {type(self).__name__} by '
                f'{type(scalar).__name__}')

        return cg_base.CgBase.from_array(scalar * np.array(self))

    def __truediv__(self, scalar):
        """Vector / Scalar = Vector"""
        return self * (1 / scalar)

    def __neg__(self):
        """-Vector"""
        return self * -1

    def dot(self, other):
        """Vector dot Vector = Scalar"""
        if not isinstance(other, Vector):
            raise TypeError(
                f'Can only dot Vector with Vector, not {type(other).__name__}')

        return np.dot(np.array(self), np.array(other))

    def __abs__(self):
        """||Vector||"""
        return math.sqrt(self.dot(self))

    def angle(self, other):
        """Angle between two vectors"""
        if not isinstance(other, Vector):
            raise TypeError(
                f'Can only find angle between Vector and '
                f'{type(self).__name__}')

        return math.acos(self.dot(other) / (abs(self) * abs(other)))

    @property
    def unit(self):
        """The unit vector in the direction of this vector"""
        return self / abs(self)

    def cross(self, other):
        """Vector cross Vector = Vector"""
        if not isinstance(other, Vector):
            raise TypeError(
                f'Can only cross Vector with Vector, not '
                f'{type(other).__name__}')

        return Vector(*np.cross(np.array(self)[:3], np.array(other)[:3]))

    @property
    def spherical(self):
        """The spherical coordinates representation of the vector.
        Returns radius, theta, phi"""
        radius = abs(self)
        theta = Vector.k_hat.angle(self)
        xy_projection = Vector(self.i, self.j, 0) or Vector.i_hat
        phi = Vector.i_hat.angle(xy_projection)
        return radius, theta, phi


class Frame(operations.GlobalOps):
    __slots__ = '__local', '__x', '__y', '__z', '__origin'

    @classmethod
    def from_array(cls, array):
        if array.shape == (4, 4) and (array[3] == [0, 0, 0, 1]).all():
            return cls(*map(
                super().from_array,
                array.T
            ))

    @classmethod
    def from_z_axis(cls, z: Vector, origin: Point=Point.origin):
        """Return a new frame whose z axis is equivalent to the z vector"""
        to_origin = origin - Point.origin
        radius, theta, phi = z.spherical
        return cls.unit \
            .scale(radius) \
            .rotate_y(theta) \
            .rotate_z(phi) \
            .translate(to_origin)

    def __new__(cls, x: Vector, y: Vector, z: Vector, origin: Point):
        self = super().__new__(cls)
        self.__local = LocalFrame(x, y, z, origin)
        return self

    def __init__(self, x: Vector, y: Vector, z: Vector, origin: Point):
        super().__init__(np.array(list(map(np.array, (x, y, z, origin)))).T)
        self._args = x, y, z, origin
        self.__x = x
        self.__y = y
        self.__z = z
        self.__origin = origin

    @property
    def local(self):
        """The Frame object whose operation methods are performed with
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
        """Calculate the inverse frame of this frame"""
        return cg_base.CgBase.from_array(np.linalg.inv(np.array(self)))


class LocalFrame(operations.FrameLocalOps, Frame):
    __slots__ = ()

    def __new__(cls, x: Vector, y: Vector, z: Vector, origin: Point):
        # use the method that Frame inherited
        return super(Frame, cls).__new__(cls)


def _init_frame(cls):
    cls.unit = cls(Vector.i_hat, Vector.j_hat, Vector.k_hat, Point.origin)
    return cls


Frame = _init_frame(Frame)
