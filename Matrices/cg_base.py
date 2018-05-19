import functools
import math
import numpy as np

__all__ = ['CgBase', 'Frame', 'Point', 'Vector', *'ijkof']


class CgBase:
    @classmethod
    def _from_array(cls, array):
        # Create the appropriate subclass based on an array's structure
        if array.shape == (4, 4) and all(array[3] == [0, 0, 0, 1]):
            return Frame(*map(cls._from_array, array.T))
        elif array.shape == (4, ):
            if array[3] == 0:
                return Vector(*array[:3])
            elif array[3] == 1:
                return Point(*array[:3])

        raise TypeError(f'Unknown array structure: {repr(array)}')

    def __matmul__(self, other):
        return CgBase._from_array(self.matrix @ other.matrix)

    def __eq__(self, other):
        return (self.matrix == other.matrix).all()

    def __neq__(self, other):
        return (self.matrix != other.matrix).all()

    def __repr__(self):
        return repr(self.matrix)


class Point(CgBase):
    def __init__(self, x, y, z):
        self.matrix = np.array([x, y, z, 1])

    def __add__(self, other):
        if isinstance(other, Point):
            raise TypeError(
                f'Cannot add {type(other).__name__} to {type(self).__name__}')

        return CgBase._from_array(self.matrix + other.matrix)

    def __sub__(self, other):
        if isinstance(other, Vector):
            raise TypeError(
                f'Cannot subtract {type(other).__name__} from '
                f'{type(self).__name__}')

        return CgBase._from_array(self.matrix - other.matrix)


class Vector(CgBase):
    def __init__(self, i, j, k):
        self.matrix = np.array([i, j, k, 0])

    def __add__(self, other):
        return CgBase._from_array(self.matrix + other.matrix)

    def __mul__(self, scalar):
        if isinstance(scalar, CgBase):
            raise TypeError(
                f'Cannot multiply {type(self).__name__} by '
                f'{type(scalar).__name__}')

        return CgBase._from_array(scalar * self.matrix)

    def __truediv__(self, scalar):
        return self * (1 / scalar)

    def __neg__(self):
        return self * -1

    def dot(self, other):
        if not isinstance(other, Vector):
            raise TypeError(
                f'Can only dot Vector with Vector, not {type(other).__name__}')

        return np.dot(self.matrix, other.matrix)

    def __abs__(self):
        return math.sqrt(self.dot(self))

    def angle(self, other):
        if not isinstance(other, Vector):
            raise TypeError(
                f'Can only find angle between Vector and '
                f'{type(self).__name__}')

        return math.acos(self.dot(other) / (abs(self) * abs(other)))

    @property
    def unit(self):
        return self / abs(self)

    def cross(self, other):
        if not isinstance(other, Vector):
            raise TypeError(
                f'Can only cross Vector with Vector, not '
                f'{type(other).__name__}')

        return Vector(*np.cross(self.matrix[:3], other.matrix[:3]))


class ApplyMatrixType(type):
    def __new__(cls, name, function, namespace):
        new_namespace = {
            name_: function(value)
            for name_, value in namespace.items()
            if not name_.startswith('_')}
        return type(name, (CgBase, ), new_namespace)


class UniversalMeta(type):
    def __init__(self, name, bases, namespace):
        self.Globals = ApplyMatrixType(
            'Globals', self.apply_global_matrix, namespace)
        self.Locals = ApplyMatrixType(
            'Locals', self.apply_local_matrix, namespace)

    @staticmethod
    def apply_global_matrix(function):
        @functools.wraps(function)
        def wrapped(frame, *args, **kwargs):
            transformation_matrix = function(frame, *args, **kwargs)
            transformation = CgBase._from_array(
                np.array(transformation_matrix))
            return transformation @ frame

        return wrapped

    @staticmethod
    def apply_local_matrix(function):
        @functools.wraps(function)
        def wrapped(frame, *args, **kwargs):
            transformation_matrix = function(frame, *args, **kwargs)
            transformation = CgBase._from_array(
                np.array(transformation_matrix))
            return frame @ transformation

        return wrapped


class UniversalTransformations(CgBase, metaclass=UniversalMeta):
    def scale(self, x, y=..., z=1):
        if y is ...:
            z = y = x

        return [[x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]]

    def translate(self, other: Vector):
        return np.array([[1, 0, 0, 0],
                         [0, 1, 0, 0],
                         [0, 0, 1, 0],
                         (Point(0, 0, 0) + other).matrix]).T

    def rotate_x(self, angle):
        return [[1, 0, 0, 0],
                [0, math.cos(angle), -math.sin(angle), 0],
                [0, math.sin(angle), math.cos(angle), 0],
                [0, 0, 0, 1]]

    def rotate_y(self, angle):
        return [[math.cos(angle), 0, math.sin(angle), 0],
                [0, 1, 0, 0],
                [-math.sin(angle), 0, math.cos(angle), 0],
                [0, 0, 0, 1]]

    def rotate_z(self, angle):
        return [[math.cos(angle), -math.sin(angle), 0, 0],
                [math.sin(angle), math.cos(angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]]


class GlobalTransformations(UniversalTransformations.Globals):
    def scale_center(self, x, y=..., z=1, center: Point=None):
        if center is None:
            center = self.origin

        translation = Point(0, 0, 0) - center

        return self \
            .translate(translation) \
            .scale(x, y, z) \
            .translate(-translation)


class LocalTransformations(UniversalTransformations.Locals):
    def scale_center(self, x, y=..., z=1, center: Point=None):
        if center is None:
            center = Point(0, 0, 0)

        center = self @ center
        return self.scale_center(x, y, z, center)


class LocalsType(type):
    def __new__(cls, frame):
        namespace = {
            name: cls.partial(getattr(LocalTransformations, name), frame)
            for name in dir(LocalTransformations)
            if not name.startswith('_')}
        return type.__new__(cls, 'Locals', (), namespace)

    @staticmethod
    def partial(function, frame):
        @functools.wraps(function)
        def wrapped(*args, **kwargs):
            return function(frame, *args, **kwargs)

        return wrapped


class Frame(GlobalTransformations):
    def __init__(self, x: Vector, y: Vector, z: Vector, origin: Point):
        self.origin = origin
        self.matrix = np.array([x.matrix, y.matrix, z.matrix, origin.matrix]).T
        self.local = LocalsType(self)


i = Vector(1, 0, 0)
j = Vector(0, 1, 0)
k = Vector(0, 0, 1)
o = Point(0, 0, 0)
f = Frame(i, j, k, o)

a = Point(2, 3, 4)
b = Point(-2, 5, 3)
u = Vector(4, 5, 6)
v = Vector(6, 1, -2)

g = f.translate(u).scale(2).rotate_z(2)
h = f.local.rotate_z(2).local.scale(2).local.translate(u)
assert g == h
