import math
import numpy as np
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from matplotlib.widgets import Button
from cg_objects import Frame, Point, Vector, Vertices


class VerticesPlotter(Axes3D):
    def __init__(self, frame, vertices, i_max, fig, *args, **kwargs):
        super().__init__(fig, *args, **kwargs)
        self.index = -1
        self.frame = frame
        self.vertices = vertices
        self.i_max = i_max
        self.fig = fig
        self.next(None)

    def redraw(self):
        k = self.index / self.i_max
        frame = self.frame.local.rotate_axis(
            k * math.tau,
            Vector(1, 1, 0), Point(1, 1, 2))
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

        # enfore graph minimums
        r = 20
        xs = [r, r, r, r, -r, -r, -r, -r]
        ys = [r, r, -r, -r, r, r, -r, -r]
        zs = [r, -r, r, -r, r, -r, r, -r]
        super().scatter(xs, ys, zs, c='w', marker='.')

    def update(self):
        self.cla()
        self.redraw()
        plt.draw()

    def next(self, event):
        if self.index < self.i_max:
            self.index += 1
            self.update()

    def prev(self, event):
        if self.index > 0:
            self.index -= 1
            self.update()


def main():
    f = Frame.unit \
        .translate(Vector(-5, 2, -2)) \
        .local.scale(3) \
        .local.rotate_x(-math.pi / 8)

    cube = Vertices(
        Point(1, 0, 0),
        Point(0, 1, 0),
        Point(0, 0, 1),
        Point(1, 1, 1),
        Point(1, 1, 0),
        Point(1, 0, 1),
        Point(0, 1, 1),
        Point(0, 0, 0),
    )

    fig = plt.figure()
    ax = VerticesPlotter(f, cube, 50, fig)

    axprev = plt.axes([0.7, 0.05, 0.1, 0.075])
    axnext = plt.axes([0.81, 0.05, 0.1, 0.075])
    bnext = Button(axnext, 'Next')
    bnext.on_clicked(ax.next)
    bprev = Button(axprev, 'Previous')
    bprev.on_clicked(ax.prev)

    plt.show()


if __name__ == '__main__':
    main()
