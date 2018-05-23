"""Provide a torus shape generator"""
import math
from . import cg_base, frame

__all__ = ['circle', 'torus', 'cube']


def circle(radius: cg_base.Vector, quality: int=16):
    p1 = cg_base.Point.origin + radius

    return cg_base.Vertices(*(
        frame.Frame.unit.rotate_x(math.tau * i / quality) @ p1
        for i in range(quality)
    ))


def torus(
    inner: cg_base.Vector=None, outer: cg_base.Vector=None, quality: int=16
):
    if inner is None:
        inner = cg_base.Vector(0, 2, 0)

    if outer is None:
        outer = cg_base.Vector(0, 1, 0)

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


def cube(side: cg_base.Vector=None):
    if side is None:
        side = cg_base.Vector.k_hat

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
