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

        self.ring = cg_objects.circle(cg_objects.Vector.i_hat * 2.5) \
            .rotate_y(math.pi / 2)
        self.base_frame = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(0, -6, 0))
        self.lower = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(0, 3, -3))
        self.upper = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(0, 3, 3))

    def plot_vertices(self, vertices, **kwargs):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs, **kwargs)

    def plot_minimums(self, r):
        cube = cg_objects.cube(cg_objects.Vector(0, 0, 2 * r)) \
            .translate(cg_objects.Vector(-r, -r, -r))
        self.plot_vertices(cube, c='w', marker='.')

    def plot_frame(self, frame, **kwargs):
        vectors = frame.x, frame.y, frame.z
        colors = kwargs.pop('colors', ((1, 0, 0), (0, 1, 0), (0, 0, 1)))

        for vector, color in zip(vectors, colors):
            super().quiver(
                frame.origin.x, frame.origin.y, frame.origin.z,
                vector.i, vector.j, vector.k,
                colors=color, **kwargs)

    def redraw(self):
        self.plot_minimums(10)
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
            self.plot_frame(ring_frame)
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
    ax = OlympicRingsPlotter(fig, 24)
    threading.Thread(target=loop, args=(ax.next, 6), daemon=True).start()
    plt.show()


if __name__ == '__main__':
    main()
