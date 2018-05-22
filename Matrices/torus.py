import numpy as np
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
from cg_objects import torus, Vector


class VerticesPlotter(Axes3D):
    def plot_vertices(self, vertices):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs)

        # enfore graph minimums
        r = 7
        xs = [r, r, r, r, -r, -r, -r, -r]
        ys = [r, r, -r, -r, r, r, -r, -r]
        zs = [r, -r, r, -r, r, -r, r, -r]
        super().scatter(xs, ys, zs, c='w', marker='.')


def main():
    fig = plt.figure()
    ax = VerticesPlotter(fig)

    vertices = torus(Vector(0, 5, 0), Vector(0, 2, 0))
    ax.plot_vertices(vertices)

    plt.show()


if __name__ == '__main__':
    main()
