"""Basic functionality of computer graphics objects"""
import numpy as np

__all__ = ['CgBase']


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
        """Return self @ other"""
        return CgBase.from_array(np.array(self) @ np.array(other))

    def __eq__(self, other):
        """Return self == other"""
        return (np.array(self) == np.array(other)).all()

    def __neq__(self, other):
        """Return self != other"""
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
