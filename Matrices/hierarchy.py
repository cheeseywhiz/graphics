import math
import numpy as np
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import cg_objects


class HierarchyPlotter(Axes3D):
    def __init__(self, fig):
        super().__init__(fig)

        self.outer = cg_objects.Frame.unit.scale(3)
        # Each cube is a third smaller, in the middle of its parent cube, and
        # rotated 30 degrees from its parent about its own center
        self.inner = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(1, 1, 1)) \
            .scale(1 / 3) \
            .local.rotate_axis(
                math.pi / 6, through=cg_objects.Point(.5, .5, 0)
            )
        self.cube = cg_objects.cube()

    def plot_vertices(self, vertices, **kwargs):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs, **kwargs)

    def plot_minimums(self, r):
        cube = cg_objects.cube(cg_objects.Vector(0, 0, r))
        self.plot_vertices(cube, c='w', marker='.')

    def redraw(self):
        self.plot_minimums(3)
        frame = self.outer

        for i in range(5):
            self.plot_vertices(frame @ self.cube)
            frame @= self.inner

    def update(self):
        self.cla()
        self.redraw()
        plt.draw()


def main():
    fig = plt.figure()
    ax = HierarchyPlotter(fig)
    ax.update()
    plt.show()


if __name__ == '__main__':
    main()
