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


class VerticesPlotter(Axes3D):
    def __init__(self, fig, slowness):
        super().__init__(fig)
        self.index = 0
        self.slowness = slowness

        self.axis = cg_objects.Vector.i_hat
        self._inner = cg_objects.torus(quality=10)
        self._outer = cg_objects.torus(
            cg_objects.Vector(0, 5, 0), cg_objects.Vector(0, 1, 0),
            quality=20)

    def plot_vertices(self, vertices, **kwargs):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs, **kwargs)

    def plot_minimums(self, r):
        cube = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(-r, -r, -r)) \
            @ cg_objects.cube(cg_objects.Vector(0, 0, 2 * r))
        self.plot_vertices(cube, c='w', marker='.')

    @property
    def inner(self):
        return cg_objects.Frame.unit.rotate_axis(
            self.k * math.tau, self.axis, cg_objects.Point.origin
        ) @ self._inner

    @property
    def outer(self):
        return cg_objects.Frame.unit.rotate_axis(
            -self.k * math.tau, self.axis, cg_objects.Point.origin
        ) @ self._outer

    def redraw(self):
        self.plot_minimums(6)
        self.plot_vertices(self.inner)
        self.plot_vertices(self.outer)

    def next(self):
        self.index += 1
        self.k = self.index / self.slowness
        self.cla()
        self.redraw()
        plt.draw()


def main():
    fig = plt.figure()
    ax = VerticesPlotter(fig, 24)
    threading.Thread(target=loop, args=(ax.next, 6), daemon=True).start()
    plt.show()


if __name__ == '__main__':
    main()
