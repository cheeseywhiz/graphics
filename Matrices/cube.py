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


class CubePlotter(Axes3D):
    def __init__(self, fig, slowness, frame, vertices):
        super().__init__(fig)
        self.index = 0
        self.frame = frame
        self.vertices = vertices
        self.slowness = slowness
        self.fig = fig

    def plot_vertices(self, vertices, **kwargs):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs, **kwargs)

    def plot_minimums(self, r):
        cube = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(-r, -r, -r)) \
            @ cg_objects.cube(cg_objects.Vector(0, 0, 2 * r))
        self.plot_vertices(cube, c='w', marker='.')

    def redraw(self):
        frame = self.frame.local.rotate_axis(
            self.k * math.tau,
            cg_objects.Vector(1, 1, 0), cg_objects.Point(1, 1, 2))
        xs, ys, zs, _ = np.array(frame @ self.vertices)

        # global and local rgb xyz axes
        super().scatter(
            [1, xs[0]], [0, ys[0]], [0, zs[0]],
            c='r', depthshade=False)
        super().scatter(
            [0, xs[1]], [1, ys[1]], [0, zs[1]],
            c='g', depthshade=False)
        super().scatter(
            [0, xs[2]], [0, ys[2]], [1, zs[2]],
            c='b', depthshade=False)

        # black box
        super().scatter(xs[3:], ys[3:], zs[3:], c='0', depthshade=False)

        # global and local origin
        xs = [0, self.frame.origin.x]
        ys = [0, self.frame.origin.y]
        zs = [0, self.frame.origin.z]
        super().scatter(xs, ys, zs, c='0', marker='x')

        self.plot_minimums(13)

    def next(self):
        self.index += 1
        self.k = self.index / self.slowness
        self.cla()
        self.redraw()
        plt.draw()


def main():
    f = cg_objects.Frame.unit \
        .translate(cg_objects.Vector(-5, 2, -2)) \
        .local.scale(3) \
        .local.rotate_x(-math.pi / 8)

    cube = cg_objects.Vertices(
        cg_objects.Point(1, 0, 0),
        cg_objects.Point(0, 1, 0),
        cg_objects.Point(0, 0, 1),
        cg_objects.Point(1, 1, 1),
        cg_objects.Point(1, 1, 0),
        cg_objects.Point(1, 0, 1),
        cg_objects.Point(0, 1, 1),
        cg_objects.Point(0, 0, 0),
    )

    fig = plt.figure()
    ax = CubePlotter(fig, 50, f, cube)
    threading.Thread(target=loop, args=(ax.next, 6), daemon=True).start()
    plt.show()


if __name__ == '__main__':
    main()
