"""Basic functionality with fundamental operations"""
import functools
import math
import numpy as np

__all__ = ['CgBase', 'StandardOperations']


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


class StandardMeta(CgMeta):
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
            operation = CgBase.from_array(
                np.array(operation_matrix))
            return operation @ cg_object

        return wrapped

    @staticmethod
    def apply_local_matrix(function):
        @functools.wraps(function)
        def wrapped(cg_object, *args, **kwargs):
            operation_matrix = function(cg_object, *args, **kwargs)
            operation = CgBase.from_array(
                np.array(operation_matrix))
            return cg_object @ operation

        return wrapped


class StandardOperations(CgBase, metaclass=StandardMeta):
    __slots__ = ()

    def scale(self, x, y=..., z=1):
        """Scale the frame with respect to the origin"""
        if y is ...:
            z = y = x

        return [[x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]]

    def translate(self, operand):
        """Translate the frame with respect to a vector"""
        return [
            [1, 0, 0, operand.i],
            [0, 1, 0, operand.j],
            [0, 0, 1, operand.k],
            [0, 0, 0, 1],
        ]

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
