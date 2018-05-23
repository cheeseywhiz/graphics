"""Provide a torus shape generator"""
import math
from . import cg_base, frame

__all__ = ['circle', 'torus', 'cube', 't_pose']


def circle(radius: cg_base.Vector, quality: int=16):
    """A circle in the xz-plane with the specified radius vector"""
    p1 = cg_base.Point.origin + radius
    return cg_base.Vertices(*(
        frame.Frame.unit.rotate_x(math.tau * i / quality) @ p1
        for i in range(quality)
    ))


def torus(
    inner: cg_base.Vector=cg_base.Vector(0, 2, 0),
    outer: cg_base.Vector=cg_base.Vector(0, 1, 0), quality: int=16
):
    """A torus made of circles of the outer radius whose centers form a circle
    of the inner radius"""
    circles = (
        frame.Frame.unit
        .translate(inner)
        .rotate_z(math.tau * i / quality) @ circle(outer, quality=quality)
        for i in range(quality)
    )

    vertices = []

    for circle_ in circles:
        for point in circle_:
            vertices.append(point)

    return cg_base.Vertices(*vertices)


def cube(side: cg_base.Vector=cg_base.Vector.k_hat):
    """A cube whose vertical edge is formed from the side vector"""
    unit_cube = cg_base.Vertices(
        cg_base.Point(0, 0, 0),
        cg_base.Point(0, 0, 1),
        cg_base.Point(0, 1, 0),
        cg_base.Point(0, 1, 1),
        cg_base.Point(1, 0, 0),
        cg_base.Point(1, 0, 1),
        cg_base.Point(1, 1, 0),
        cg_base.Point(1, 1, 1))
    return frame.Frame.from_z_axis(side) @ unit_cube


def t_pose():
    # The unit t pose only
    return cg_base.Vertices(
        cg_base.Point(0, 0, 1),
        cg_base.Point(0, 0, 2),
        cg_base.Point(0, 1, 1),
        cg_base.Point(0, 1, 2),
        cg_base.Point(3, 0, 1),
        cg_base.Point(3, 0, 2),
        cg_base.Point(3, 1, 1),
        cg_base.Point(3, 1, 2),
        cg_base.Point(1, 0, 0),
        cg_base.Point(1, 0, 1),
        cg_base.Point(1, 1, 0),
        cg_base.Point(1, 1, 1),
        cg_base.Point(2, 0, 0),
        cg_base.Point(2, 0, 1),
        cg_base.Point(2, 1, 0),
        cg_base.Point(2, 1, 1))
