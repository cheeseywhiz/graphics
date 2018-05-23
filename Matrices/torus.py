import math
import threading
import time
import numpy as np
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from cg_objects import torus, Vector, Frame, Point


def loop(func, fps):
    while True:
        func()
        time.sleep(1 / fps)


def start_loop(func, fps):
    threading.Thread(target=loop, args=(func, fps), daemon=True).start()


class VerticesPlotter(Axes3D):
    def __init__(self, fig, slowness):
        super().__init__(fig)
        self.index = 0
        self.slowness = slowness

        self.axis = Vector.i_hat
        self._inner = torus(quality=10)
        self._outer = torus(Vector(0, 5, 0), Vector(0, 1, 0), quality=20)

    def plot_vertices(self, vertices):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs)

    def plot_minimum_window(self, r):
        xs = [r, r, r, r, -r, -r, -r, -r]
        ys = [r, r, -r, -r, r, r, -r, -r]
        zs = [r, -r, r, -r, r, -r, r, -r]
        super().scatter(xs, ys, zs, c='w', marker='.')

    @property
    def inner(self):
        return Frame.unit.rotate_axis(
            self.k * math.tau, self.axis, Point.origin
        ) @ self._inner

    @property
    def outer(self):
        return Frame.unit.rotate_axis(
            -self.k * math.tau, self.axis, Point.origin
        ) @ self._outer

    def redraw(self):
        self.plot_minimum_window(10)
        self.plot_vertices(self.inner)
        self.plot_vertices(self.outer)

    def update(self):
        self.k = self.index / self.slowness
        self.cla()
        self.redraw()
        plt.draw()

    def next(self, event):
        self.index += 1
        self.update()


def main():
    fig = plt.figure()
    ax = VerticesPlotter(fig, 24)
    start_loop(lambda: ax.next(None), 6)
    plt.show()


if __name__ == '__main__':
    main()
