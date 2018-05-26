import math
import threading
import time
import numpy as np
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import cg_objects


class RotationPlotter(Axes3D):
    def __init__(self, fig):
        super().__init__(fig)
        self.time_0 = None
        self.time_1 = 0

        self.gravity = cg_objects.Vector.k_hat * -9.80665

        self.radius = 1
        self._model = cg_objects.circle(cg_objects.Vector(self.radius, 0, 0)) \
            .rotate_x(math.pi / 2)

        self.height = 2
        self.run = 10
        self.incline = cg_objects.Vector(self.run, 0, -self.height)
        self.angle = cg_objects.Vector.i_hat.angle(self.incline)

        self.incline_frame = cg_objects.Frame.unit \
            .rotate_y(self.angle) \
            .translate(cg_objects.Vector(0, 0, self.height))
        self.tangent_frame = self.incline_frame
        self.model_frame = self.tangent_frame

    @property
    def model(self):
        position = self.gravity.project_onto(self.incline_frame.x) * \
            ((self.time_1 ** 2) / 4)
        angle = abs(position) / self.radius
        self.tangent_frame = self.incline_frame.translate(position)
        self.model_frame = self.tangent_frame \
            .local.translate(cg_objects.Vector(0, 0, self.radius)) \
            .local.rotate_y(angle)
        return self.model_frame @ self._model

    def plot_vertices(self, vertices, **kwargs):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs, **kwargs)

    def plot_frame(self, frame, **kwargs):
        vectors = frame.x, frame.y, frame.z
        colors = kwargs.pop('colors', ((1, 0, 0), (0, 1, 0), (0, 0, 1)))

        for vector, color in zip(vectors, colors):
            super().quiver(
                frame.origin.x, frame.origin.y, frame.origin.z,
                vector.i, vector.j, vector.k,
                colors=color, **kwargs)

    def plot_minimums(self):
        box = cg_objects.rectangular_prism(
            cg_objects.Point(
                -2 * self.radius,
                -1,
                0),
            cg_objects.Point(
                1 + self.run + self.height + 2 * self.radius,
                self.run + self.height + 4 * self.radius,
                1 + self.run + self.height + 4 * self.radius))
        self.plot_vertices(box, c='w', marker='.')

    def redraw(self):
        self.plot_minimums()
        self.plot_vertices(self.model)
        self.plot_frame(cg_objects.Frame.unit)
        self.plot_frame(self.incline_frame)
        self.plot_frame(self.tangent_frame)
        self.plot_frame(self.model_frame)

    def update(self):
        if self.time_0 is None:
            self.time_0 = time.time()

        self.time_1 = time.time() - self.time_0
        self.cla()
        self.redraw()
        plt.draw()

    def loop(self, fps):
        self.redraw()
        time.sleep(3)

        while self.tangent_frame.origin.z >= 0:
            self.update()
            time.sleep(1 / fps)


def main():
    fig = plt.figure()
    ax = RotationPlotter(fig)
    threading.Thread(target=ax.loop, args=(6, ), daemon=True).start()
    plt.show()


if __name__ == '__main__':
    main()
