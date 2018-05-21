import functools
import math
import numpy as np

__all__ = ['CgBase', 'Frame', 'Point', 'Vector', 'Vertices']


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


def set_point_constant(cls):
    cls.origin = cls(0, 0, 0)
    return cls


@set_point_constant
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


class StandardMeta(CgMeta):
    def __init__(self, name, bases, namespace):
        self.Globals = self.decorate_type_attrs(
            name + '.Globals', bases, namespace, self.apply_global_matrix)
        self.Locals = self.decorate_type_attrs(
            name + '.Locals', bases, namespace, self.apply_local_matrix)

    @staticmethod
    def decorate_type_attrs(name, bases, namespace, decorator):
        new_namespace = namespace.copy()
        new_namespace.update({
            name_: decorator(value)
            for name_, value in namespace.items()
            if not name_.startswith('_')})
        return type(name, bases, new_namespace)

    @staticmethod
    def apply_global_matrix(function):
        @functools.wraps(function)
        def wrapped(frame, *args, **kwargs):
            transformation_matrix = function(frame, *args, **kwargs)
            transformation = CgBase.from_array(
                np.array(transformation_matrix))
            return transformation @ frame

        return wrapped

    @staticmethod
    def apply_local_matrix(function):
        @functools.wraps(function)
        def wrapped(frame, *args, **kwargs):
            transformation_matrix = function(frame, *args, **kwargs)
            transformation = CgBase.from_array(
                np.array(transformation_matrix))
            return frame @ transformation

        return wrapped


class StandardTransformations(CgBase, metaclass=StandardMeta):
    __slots__ = ()

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


class GlobalTransformations(StandardTransformations.Globals):
    __slots__ = ()

    def scale_center(self, x, y=..., z=1, center: Point=None):
        """Scale the frame with respect to a center of magnification"""
        if center is None:
            center = self.origin

        translation = Point.origin - center

        return super() \
            .translate(translation) \
            .scale(x, y, z) \
            .translate(-translation)

    def rotate_axis(self, angle, axis: Vector=None, through: Point=None):
        """Rotate the frame around an axis that is parallel to a vector and
        passes through a point"""
        if axis is None:
            axis = Vector.k

        if through is None:
            through = Point.origin

        theta = Vector.k.angle(axis)
        xy_projection = Vector(axis.x, axis.y, 0)

        if xy_projection:
            phi = Vector.i.angle(xy_projection)
        else:
            phi = 0

        # axis_frame's z axis is parallel to the specified axis and its origin
        # is the specified point
        axis_frame = Frame.unit \
            .rotate_y(theta) \
            .rotate_z(phi) \
            .translate(through - Point.origin)

        # represent self in terms of axis_frame
        new_frame = axis_frame.inv() @ self
        # then rotate axis_frame and reevaluate new_frame
        return axis_frame.local.rotate_z(angle) @ new_frame


class LocalTransformations(StandardTransformations.Locals,
                           GlobalTransformations):
    __slots__ = ()

    def scale_center(self, x, y=..., z=1, center: Point=None):
        if center is None:
            center = Point.origin

        center = self @ center
        return super().scale_center(x, y, z, center)

    def rotate_axis(self, angle, axis: Vector=None, through: Point=None):
        if axis is None:
            axis = Vector.k

        if through is None:
            through = Point.origin

        axis = self @ axis
        through = self @ through
        return super().rotate_axis(angle, axis, through)


class Frame(GlobalTransformations):
    __slots__ = 'local', 'x', 'y', 'z', 'origin'

    @classmethod
    def from_array(cls, array):
        if array.shape == (4, 4) and (array[3] == [0, 0, 0, 1]).all():
            return cls(*map(
                super().from_array,
                array.T
            ))

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

    def inv(self):
        """Calculate the inverse of a matrix"""
        return CgBase.from_array(np.linalg.inv(self.matrix))


class LocalFrame(LocalTransformations, Frame):
    __slots__ = ()

    def __new__(cls, x: Vector, y: Vector, z: Vector, origin: Point):
        return object.__new__(cls)


def _init_frame(cls):
    cls.unit = cls(Vector.i, Vector.j, Vector.k, Point.origin)
    return cls


Frame = _init_frame(Frame)


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
