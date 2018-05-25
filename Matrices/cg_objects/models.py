"""Provide a number of shapes represented as Vertices objects"""
import math
from . import fundamental

__all__ = ['circle', 'torus', 'cube', 't_pose', 'rectangular_prism']


def circle(
    radius: fundamental.Vector=fundamental.Vector.i_hat,
    quality: int=16
):
    """A circle in the xy-plane with the specified radius vector"""
    return fundamental.Vertices(*(
        fundamental.Point.origin
        .translate(radius)
        .rotate_z(math.tau * i / quality)
        for i in range(quality)
    ))


def torus(
    inner: fundamental.Vector=fundamental.Vector(2, 0, 0),
    outer: fundamental.Vector=fundamental.Vector.i_hat,
    quality: int=16
):
    """A torus made of circles of the outer radius whose centers form a circle
    of the inner radius"""
    return fundamental.Vertices.join(*(
        circle(outer, quality=quality)
        .rotate_x(math.pi / 2)
        .translate(inner)
        .rotate_z(math.tau * i / quality)
        for i in range(quality)
    ))


def rectangular_prism(
    corner1: fundamental.Point=fundamental.Point(1, 1, 1),
    corner2: fundamental.Point=fundamental.Point.origin
):
    return fundamental.Vertices(
        fundamental.Point(corner2.x, corner2.y, corner2.z),
        fundamental.Point(corner2.x, corner2.y, corner1.z),
        fundamental.Point(corner2.x, corner1.y, corner2.z),
        fundamental.Point(corner2.x, corner1.y, corner1.z),
        fundamental.Point(corner1.x, corner2.y, corner2.z),
        fundamental.Point(corner1.x, corner2.y, corner1.z),
        fundamental.Point(corner1.x, corner1.y, corner2.z),
        fundamental.Point(corner1.x, corner1.y, corner1.z))


def cube(side: fundamental.Vector=fundamental.Vector.k_hat):
    """A cube whose vertical edge is formed from the side vector"""
    return fundamental.Frame.from_z_axis(side) @ rectangular_prism()


def t_pose():
    """A T shape"""
    # The unit t pose only
    return rectangular_prism(
        fundamental.Point(0, 0, 1),
        fundamental.Point(3, 1, 2),
    ) + rectangular_prism(
        fundamental.Point(1, 0, 0),
        fundamental.Point(2, 1, 1))
