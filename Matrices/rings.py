import math
import threading
import time
import numpy as np
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import cg_objects


def loop(func, fps):
    while True:
        func()
        time.sleep(1 / fps)


class OlympicRingsPlotter(Axes3D):
    def __init__(self, fig, slowness):
        super().__init__(fig)
        self.index = 0
        self.slowness = slowness

        self.ring = cg_objects.circle(cg_objects.Vector.i_hat * 10) \
            .rotate_y(math.pi / 2)
        self.base_frame = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(0, -24, 0))
        self.lower = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(0, 12, -12))
        self.upper = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(0, 12, 12))

    def plot_vertices(self, vertices, **kwargs):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs, **kwargs)

    def plot_minimums(self, r):
        cube = cg_objects.cube(cg_objects.Vector(0, 0, 2 * r)) \
            .translate(cg_objects.Vector(-r, -r, -r))
        self.plot_vertices(cube, c='w', marker='.')

    def redraw(self):
        self.plot_minimums(40)
        rings = (
            (self.base_frame, 'b', 1),
            (self.lower, 'y', -1),
            (self.upper, '0', 1),
            (self.lower, 'g', -1),
            (self.upper, 'r', 1))
        ring_frame = cg_objects.Frame.unit

        rotation = {
            1: cg_objects.Frame.unit.rotate_x(self.k * math.tau),
            -1: cg_objects.Frame.unit.rotate_x(-self.k * math.tau)}

        for frame, color, direction in rings:
            ring_frame @= frame
            self.plot_vertices(
                ring_frame @ rotation[direction] @ self.ring, c=color
            )

    def next(self):
        self.index += 1
        self.k = self.index / self.slowness
        self.cla()
        self.redraw()
        plt.draw()


def main():
    fig = plt.figure()
    ax = OlympicRingsPlotter(fig, 18)
    threading.Thread(target=loop, args=(ax.next, 6), daemon=True).start()
    plt.show()


if __name__ == '__main__':
    main()
