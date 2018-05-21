"""Fundamental matrix math types"""
import math
import numpy as np

__all__ = ['CgBase', 'Point', 'Vector', 'Vertices']


class CgMeta(type):
    """Record which subclasses override cls.from_array()"""
    base = None
    subclasses = []

    def __new__(cls, name, bases, namespace):
        self = super().__new__(cls, name, bases, namespace)

        if cls.base is None:
            cls.base = self
        elif 'from_array' in namespace:
            cls.subclasses.append(self)

        return self


class CgBase(metaclass=CgMeta):
    __slots__ = 'matrix'

    @classmethod
    def from_array(cls, array):
        """Construct a new object from a numpy array"""
        for subclass in type(cls).subclasses:
            new_object = subclass.from_array(array)

            if new_object is not None:
                return new_object
        else:
            # Possible improper multiplication?
            raise TypeError(f'Unknown array structure: {str(array)}')

    def __array__(self):
        return self.matrix

    def __matmul__(self, other):
        return CgBase.from_array(self.matrix @ other.matrix)

    def __eq__(self, other):
        return (self.matrix == other.matrix).all()

    def __neq__(self, other):
        return (self.matrix != other.matrix).all()

    def __hash__(self):
        if self.matrix.ndim == 1:
            matrix = [self.matrix]
        else:
            matrix = self.matrix

        return hash(tuple(tuple(row) for row in matrix))

    def __repr__(self):
        return str(self.matrix)


def _init_point(cls):
    cls.origin = cls(0, 0, 0)
    return cls


@_init_point
class Point(CgBase):
    __slots__ = 'x', 'y', 'z'

    @classmethod
    def from_array(cls, array):
        if array.shape == (4, ) and array[3] == 1:
            return cls(*array[:3])

    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
        self.matrix = np.array([x, y, z, 1])

    def __add__(self, other):
        """Point + Vector = Point"""
        if isinstance(other, Point):
            raise TypeError(
                f'Cannot add {type(other).__name__} to {type(self).__name__}')

        return CgBase.from_array(self.matrix + other.matrix)

    def __sub__(self, other):
        """Tail - Head = Vector from Head to Tail"""
        if isinstance(other, Vector):
            raise TypeError(
                f'Cannot subtract {type(other).__name__} from '
                f'{type(self).__name__}')

        return CgBase.from_array(self.matrix - other.matrix)


class Vertices(CgBase):
    __slots__ = ()

    @classmethod
    def from_array(cls, array):
        if array.ndim == 2 and array.shape[0] == 4 and (array[3] == 1).all():
            return cls(*(  # why does super needs arguments here?
                super(Vertices, cls).from_array(tup)
                for tup in array.T
            ))

    def __init__(self, *points):
        self.matrix = np.array(list(map(np.array, points))).T


def _init_vector(cls):
    cls.i = cls(1, 0, 0)
    cls.j = cls(0, 1, 0)
    cls.k = cls(0, 0, 1)
    cls.zero = cls(0, 0, 0)
    return cls


@_init_vector
class Vector(CgBase):
    __slots__ = 'x', 'y', 'z'

    @classmethod
    def from_array(cls, array):
        if array.shape == (4, ) and array[3] == 0:
            return cls(*array[:3])

    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
        self.matrix = np.array([x, y, z, 0])

    def __bool__(self):
        """False if zero vector else True"""
        return bool(self.matrix.any())

    def __add__(self, other):
        """Vector + Vector = Vector
        Vector + Point = Point"""
        return CgBase.from_array(self.matrix + other.matrix)

    def __mul__(self, scalar):
        """Vector * Scalar = Vector"""
        if isinstance(scalar, CgBase):
            raise TypeError(
                f'Cannot multiply {type(self).__name__} by '
                f'{type(scalar).__name__}')

        return CgBase.from_array(scalar * self.matrix)

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

        return np.dot(self.matrix, other.matrix)

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

        return Vector(*np.cross(self.matrix[:3], other.matrix[:3]))
