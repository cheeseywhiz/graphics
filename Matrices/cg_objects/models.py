"""Provide a number of shapes represented as Vertices objects"""
import math
from . import fundamental

__all__ = ['circle', 'torus', 'cube', 't_pose']


def circle(radius: fundamental.Vector, quality: int=16):
    """A circle in the xz-plane with the specified radius vector"""
    return fundamental.Vertices(*(
        fundamental.Frame.unit
        .translate(radius)
        .rotate_x(math.tau * i / quality) @ fundamental.Point.origin
        for i in range(quality)
    ))


def torus(
    inner: fundamental.Vector=fundamental.Vector(0, 2, 0),
    outer: fundamental.Vector=fundamental.Vector(0, 1, 0), quality: int=16
):
    """A torus made of circles of the outer radius whose centers form a circle
    of the inner radius"""
    circles = (
        fundamental.Frame.unit
        .translate(inner)
        .rotate_z(math.tau * i / quality) @ circle(outer, quality=quality)
        for i in range(quality)
    )

    vertices = []

    for circle_ in circles:
        for point in circle_:
            vertices.append(point)

    return fundamental.Vertices(*vertices)


def cube(side: fundamental.Vector=fundamental.Vector.k_hat):
    """A cube whose vertical edge is formed from the side vector"""
    unit_cube = fundamental.Vertices(
        fundamental.Point(0, 0, 0),
        fundamental.Point(0, 0, 1),
        fundamental.Point(0, 1, 0),
        fundamental.Point(0, 1, 1),
        fundamental.Point(1, 0, 0),
        fundamental.Point(1, 0, 1),
        fundamental.Point(1, 1, 0),
        fundamental.Point(1, 1, 1))
    return fundamental.Frame.from_z_axis(side) @ unit_cube


def t_pose():
    """A T shape"""
    # The unit t pose only
    return fundamental.Vertices(
        fundamental.Point(0, 0, 1),
        fundamental.Point(0, 0, 2),
        fundamental.Point(0, 1, 1),
        fundamental.Point(0, 1, 2),
        fundamental.Point(3, 0, 1),
        fundamental.Point(3, 0, 2),
        fundamental.Point(3, 1, 1),
        fundamental.Point(3, 1, 2),
        fundamental.Point(1, 0, 0),
        fundamental.Point(1, 0, 1),
        fundamental.Point(1, 1, 0),
        fundamental.Point(1, 1, 1),
        fundamental.Point(2, 0, 0),
        fundamental.Point(2, 0, 1),
        fundamental.Point(2, 1, 0),
        fundamental.Point(2, 1, 1))
