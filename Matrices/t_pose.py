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


class TPosePlotter(Axes3D):
    def __init__(self, fig, slowness):
        super().__init__(fig)
        self.slowness = slowness
        self.index = 0

        self._t_pose = cg_objects.t_pose()

    def plot_vertices(self, vertices, **kwargs):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs, **kwargs)

    def plot_minimums(self, r):
        cube = cg_objects.cube(cg_objects.Vector(0, 0, 2 * r)) \
            .translate(cg_objects.Vector(-r, -r, -r))
        self.plot_vertices(cube, c='w', marker='.')

    @property
    def t_pose(self):
        return self._t_pose.rotate_axis(
            self.k * math.tau, through=cg_objects.Point(1.5, .5, 0)
        )

    def redraw(self):
        self.plot_minimums(4)
        self.plot_vertices(self.t_pose)

    def next(self):
        self.index += 1
        self.k = self.index / self.slowness
        self.cla()
        self.redraw()
        plt.draw()


def main():
    fig = plt.figure()
    ax = TPosePlotter(fig, 24)
    threading.Thread(target=loop, args=(ax.next, 6), daemon=True).start()
    plt.show()


if __name__ == '__main__':
    main()
