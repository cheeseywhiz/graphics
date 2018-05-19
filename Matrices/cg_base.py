import functools
import math
import types
import numpy as np

__all__ = ['CgBase', 'Frame', 'Point', 'Vector', *'ijkoabuvfg']


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
        matrix = [self.matrix] if self.matrix.ndim == 1 else self.matrix
        lines = ('\t'.join(map(str, row)) for row in matrix)
        return '\n'.join(lines)


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


class TransformationMeta(type):
    def __new__(cls, name, bases, namespace):
        # functions stored as static methods
        namespace.update({
            name_: staticmethod(value)
            for name_, value in namespace.items()
            if isinstance(value, types.FunctionType)})
        return type.__new__(cls, name, bases, namespace)

    def __init__(self, name, bases, namespace):
        # easy access to non-hidden attributes
        self._funcs = {
            name_: getattr(self, name_)
            for name_ in vars(self)
            if not name_.startswith('_')}


class Transformations(metaclass=TransformationMeta):
    def scale(x, y=..., z=1):
        if y is ...:
            z = y = x

        return [[x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]]

    def translate(other: Vector):
        return np.array([[1, 0, 0, 0],
                         [0, 1, 0, 0],
                         [0, 0, 1, 0],
                         (Point(0, 0, 0) + other).matrix]).T

    def rotate_x(angle):
        return [[1, 0, 0, 0],
                [0, math.cos(angle), -math.sin(angle), 0],
                [0, math.sin(angle), math.cos(angle), 0],
                [0, 0, 0, 1]]

    def rotate_y(angle):
        return [[math.cos(angle), 0, math.sin(angle), 0],
                [0, 1, 0, 0],
                [-math.sin(angle), 0, math.cos(angle), 0],
                [0, 0, 0, 1]]

    def rotate_z(angle):
        return [[math.cos(angle), -math.sin(angle), 0, 0],
                [math.sin(angle), math.cos(angle), 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]]

    @classmethod
    def rotate(cls, x, y, z):
        x, y, z = cls.rotate_x(x), cls.rotate_y(y), cls.rotate_z(z)
        x, y, z = map(np.array, (x, y, z))
        return x @ y @ z


class GlobalTransformations(metaclass=TransformationMeta):
    def scale_center(self, x, y=..., z=1, center: Point=None):
        if center is None:
            center = self.o

        translation = Point(0, 0, 0) - center

        return self \
            .translate(translation) \
            .scale(x, y, z) \
            .translate(-translation)

    def rotate_center(self, x, y, z, center: Point=None):
        if center is None:
            center = self.o

        translation = Point(0, 0, 0) - center

        return self \
            .translate(translation) \
            .rotate(x, y, z) \
            .translate(-translation)


class LocalTransformations(metaclass=TransformationMeta):
    def scale_center(self, x, y=..., z=1, center: Point=None):
        if center is None:
            center = Point(0, 0, 0)

        center = self @ center
        return self.scale_center(x, y, z, center)

    def rotate_center(self, x, y, z, center: Point=None):
        if center is None:
            center = Point(0, 0, 0)

        center = self @ center
        return self.rotate_center(x, y, z, center)


class LocalsMeta(type):
    def __new__(cls, frame):
        decorator = cls.apply_local(frame)
        namespace = {}
        # Store frame in closure
        namespace.update({
            name: decorator(value)
            for name, value in Transformations._funcs.items()})
        # Store frame in partial application
        namespace.update({
            name: functools.partial(value, frame)
            for name, value in LocalTransformations._funcs.items()})
        return type.__new__(cls, 'Locals', (), namespace)

    @staticmethod
    def apply_local(frame):
        def decorator(function):
            @functools.wraps(function)
            def wrapper(*args, **kwargs):
                transformation_matrix = function(*args, **kwargs)
                transformation = CgBase._from_array(
                    np.array(transformation_matrix))
                return frame @ transformation

            return wrapper

        return decorator


class FrameMeta(type):
    def __new__(cls, name, bases, namespace):
        namespace.update({
            name_: cls._apply_global(value)
            for name_, value in Transformations._funcs.items()})
        namespace.update(GlobalTransformations._funcs)
        return type.__new__(cls, name, bases, namespace)

    @staticmethod
    def _apply_global(function):
        @functools.wraps(function)
        def wrapper(frame, *args, **kwargs):
            transformation_matrix = function(*args, **kwargs)
            transformation = CgBase._from_array(
                np.array(transformation_matrix))
            return transformation @ frame

        return wrapper


class Frame(CgBase, metaclass=FrameMeta):
    def __init__(self, x: Vector, y: Vector, z: Vector, o: Point):
        self.o = o
        self.matrix = np.array([x.matrix, y.matrix, z.matrix, o.matrix]).T
        self.local = LocalsMeta(self)


i = Vector(1, 0, 0)
j = Vector(0, 1, 0)
k = Vector(0, 0, 1)
o = Point(0, 0, 0)
f = Frame(i, j, k, o)

a = Point(2, 3, 4)
b = Point(-2, 5, 3)
u = Vector(4, 5, 6)
v = Vector(6, 1, -2)

g = f.translate(u).scale_center(2)
