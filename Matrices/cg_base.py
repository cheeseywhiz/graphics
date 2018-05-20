import functools
import math
import numpy as np

__all__ = ['CgBase', 'Frame', 'Point', 'Vector']


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

        # Possible improper multiplication?
        raise TypeError(f'Unknown array structure: {repr(array)}')

    def __matmul__(self, other):
        return CgBase._from_array(self.matrix @ other.matrix)

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


def set_point_constant(cls):
    cls.origin = cls(0, 0, 0)
    return cls


@set_point_constant
class Point(CgBase):
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

        return CgBase._from_array(self.matrix + other.matrix)

    def __sub__(self, other):
        """Tail - Head = Vector from Head to Tail"""
        if isinstance(other, Vector):
            raise TypeError(
                f'Cannot subtract {type(other).__name__} from '
                f'{type(self).__name__}')

        return CgBase._from_array(self.matrix - other.matrix)


def set_vector_constants(cls):
    cls.i = cls(1, 0, 0)
    cls.j = cls(0, 1, 0)
    cls.k = cls(0, 0, 1)
    return cls


@set_vector_constants
class Vector(CgBase):
    def __init__(self, i, j, k):
        self.i = i
        self.j = j
        self.k = k
        self.matrix = np.array([i, j, k, 0])

    def __bool__(self):
        """False if zero vector else True"""
        return bool(self.matrix.any())

    def __add__(self, other):
        """Vector + Vector = Vector
        Vector + Point = Point"""
        return CgBase._from_array(self.matrix + other.matrix)

    def __mul__(self, scalar):
        """Vector * Scalar = Vector"""
        if isinstance(scalar, CgBase):
            raise TypeError(
                f'Cannot multiply {type(self).__name__} by '
                f'{type(scalar).__name__}')

        return CgBase._from_array(scalar * self.matrix)

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


class UniversalMeta(type):
    def __init__(self, name, bases, namespace):
        self.Globals = self.decorate_type_attrs(
            name + '.Globals', bases, namespace, self.apply_global_matrix)
        self.Locals = self.decorate_type_attrs(
            name + '.Locals', bases, namespace, self.apply_local_matrix)

    @staticmethod
    def decorate_type_attrs(name, bases, namespace, decorator):
        new_namespace = {
            name_: decorator(value)
            for name_, value in namespace.items()
            if not name_.startswith('_')}
        return type(name, bases, new_namespace)

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
        """Scale the frame with respect to the origin"""
        if y is ...:
            z = y = x

        return [[x, 0, 0, 0],
                [0, y, 0, 0],
                [0, 0, z, 0],
                [0, 0, 0, 1]]

    def translate(self, other: Vector):
        """Translate the frame with respect to a vector"""
        return np.array([[1, 0, 0, 0],
                         [0, 1, 0, 0],
                         [0, 0, 1, 0],
                         (Point(0, 0, 0) + other).matrix]).T

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


class GlobalTransformations(UniversalTransformations.Globals):
    def scale_center(self, x, y=..., z=1, center: Point=None):
        """Scale the frame with respect to a center of magnification"""
        if center is None:
            center = self.origin

        translation = Point(0, 0, 0) - center

        return self \
            .translate(translation) \
            .scale(x, y, z) \
            .translate(-translation)

    def _rotate_y_center(self, angle):
        to_center = Point(0, 0, 0) - self.origin

        return self \
            .translate(to_center) \
            .rotate_y(angle) \
            .translate(-to_center)

    def _rotate_z_center(self, angle):
        to_center = Point(0, 0, 0) - self.origin

        return self \
            .translate(to_center) \
            .rotate_z(angle) \
            .translate(-to_center)

    def rotate_axis(self, angle, axis: Vector=None, through: Point=None):
        """Rotate the frame around an axis that is parallel to an axis that
        passes through a point"""
        if axis is None:
            axis = Vector(0, 0, 1)

        if through is None:
            through = Point(0, 0, 0)

        theta = Vector.k.angle(axis)
        xy_projection = Vector(axis.i, axis.j, 0)

        if xy_projection:
            phi = Vector.i.angle(xy_projection)
        else:
            phi = 0

        offset = self.origin - through
        parallel_projection = axis.unit * axis.unit.dot(offset)
        center = through + parallel_projection
        to_center = Point(0, 0, 0) - center

        return self \
            .translate(to_center) \
            ._rotate_z_center(-phi) \
            ._rotate_y_center(-theta) \
            .rotate_z(angle) \
            ._rotate_y_center(theta) \
            ._rotate_z_center(phi) \
            .translate(-to_center)


class LocalTransformations(UniversalTransformations.Locals,
                           GlobalTransformations):
    def scale_center(self, x, y=..., z=1, center: Point=None):
        if center is None:
            center = Point(0, 0, 0)

        center = self @ center
        return super().scale_center(x, y, z, center)

    def rotate_axis(self, angle, axis: Vector=None, through: Point=None):
        if axis is None:
            axis = Vector(0, 0, 1)

        if through is None:
            through = Point(0, 0, 0)

        axis = self @ axis
        through = self @ through
        return super().rotate_axis(angle, axis, through)


class Frame(GlobalTransformations):
    def __new__(cls, x: Vector, y: Vector, z: Vector, origin: Point):
        self = super().__new__(cls)
        self.local = LocalFrame(x, y, z, origin)
        return self

    def __init__(self, x: Vector, y: Vector, z: Vector, origin: Point):
        self.x = x
        self.y = y
        self.z = z
        self.origin = origin
        self.matrix = np.array([x.matrix, y.matrix, z.matrix, origin.matrix]).T


class LocalFrame(LocalTransformations, Frame):
    def __new__(cls, x: Vector, y: Vector, z: Vector, origin: Point):
        return object.__new__(cls)


def set_frame_constant(cls):
    cls.unit = cls(Vector.i, Vector.j, Vector.k, Point.origin)
    return cls


Frame = set_frame_constant(Frame)


a = Point(2, 3, 4)
b = Point(-2, 5, 3)
u = Vector(4, 5, 6)
v = Vector(6, 1, -2)

g = Frame.unit.translate(u).scale(2).rotate_z(2)
h = Frame.unit.local.rotate_z(2).local.scale(2).local.translate(u)
assert g == h

m = Frame(
    Vector(0, 1, 0),
    Vector(-1, 0, 0),
    Vector.k,
    Point(1, 1, 0)
).rotate_axis(math.pi / 2, through=Point(1, 1, math.sqrt(2)))
