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
    __slots__ = '__matrix', '_args', '_kwargs'

    @classmethod
    def from_array(cls, array):
        """Construct a new object from a numpy array"""
        for subclass in cls.subclasses:
            new_object = subclass.from_array(array)

            if new_object is not None:
                return new_object
        else:
            # Possible improper multiplication?
            raise TypeError(f'Unknown array structure: {str(array)}')

    def __init__(self, matrix):
        self.__matrix = matrix
        self._args = matrix,
        self._kwargs = {}

    def __array__(self):
        """Convert the object into a numpy array using np.array(self)"""
        return self.__matrix

    def __matmul__(self, other):
        return CgBase.from_array(np.array(self) @ np.array(other))

    def __eq__(self, other):
        return (np.array(self) == np.array(other)).all()

    def __neq__(self, other):
        return (np.array(self) != np.array(other)).all()

    def __hash__(self):
        matrix = np.array(self)

        if matrix.ndim == 1:
            matrix = [matrix]

        return hash(tuple(tuple(row) for row in matrix))

    def __str__(self):
        return str(np.array(self))

    def __repr__(self):
        name = type(self).__name__
        params = ', '.join((
            *map(repr, self._args),
            *(f'{key}={repr(value)}'
              for key, value in self._kwargs.items())
        ))
        return f'{name}({params})'


def _init_point(cls):
    cls.origin = cls(0, 0, 0)
    return cls


@_init_point
class Point(CgBase):
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

        return CgBase.from_array(np.array(self) + np.array(other))

    def __sub__(self, other):
        """Tail - Head = Vector from Head to Tail"""
        if isinstance(other, Vector):
            raise TypeError(
                f'Cannot subtract {type(other).__name__} from '
                f'{type(self).__name__}')

        return CgBase.from_array(np.array(self) - np.array(other))


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
        super().__init__(np.array(list(map(np.array, points))).T)
        self._args = points

    def __iter__(self):
        for array in np.array(self).T:
            yield CgBase.from_array(array)


def _init_vector(cls):
    cls.i_hat = cls(1, 0, 0)
    cls.j_hat = cls(0, 1, 0)
    cls.k_hat = cls(0, 0, 1)
    cls.zero = cls(0, 0, 0)
    return cls


@_init_vector
class Vector(CgBase):
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
        return CgBase.from_array(np.array(self) + np.array(other))

    def __mul__(self, scalar):
        """Vector * Scalar = Vector"""
        if isinstance(scalar, CgBase):
            raise TypeError(
                f'Cannot multiply {type(self).__name__} by '
                f'{type(scalar).__name__}')

        return CgBase.from_array(scalar * np.array(self))

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
