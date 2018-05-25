import functools
import threading
import time
import numpy as np
from matplotlib import pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import cg_objects


class FreeFallPlotter(Axes3D):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.model = cg_objects.t_pose()
        self.start = cg_objects.Frame.unit \
            .translate(cg_objects.Vector(0, 0, 200))
        self.frame = self.start
        self.time_0 = None
        self.time_1 = 0

        acceleration = cg_objects.Vector.k_hat * -9.80665
        velocity = cg_objects.Vector.zero
        position = self.start.origin - cg_objects.Point.origin
        self.position = functools.partial(
            self._physics_position, acceleration, velocity, position
        )

    @staticmethod
    def _physics_position(
        acceleration: cg_objects.Vector,
        velocity: cg_objects.Vector,
        position: cg_objects.Vector,
        time: float
    ) -> cg_objects.Vector:
        return acceleration * (time ** 2) / 2 + \
            velocity * time + \
            position

    def plot_vertices(self, vertices, **kwargs):
        xs, ys, zs, _ = np.array(vertices)
        super().scatter(xs, ys, zs, **kwargs)

    def plot_minimums(self, r):
        cube = cg_objects.cube(cg_objects.Vector(0, 0, 2 * r)) \
            .translate(cg_objects.Vector(-r, -r, 0))
        self.plot_vertices(cube, c='w', marker='.')

    def redraw(self):
        position = self.position(self.time_1)
        self.frame = cg_objects.Frame.unit.translate(position)
        self.plot_vertices(self.frame @ self.model)
        self.plot_minimums(100)

    def update(self):
        if self.time_0 is None:
            self.time_0 = time.time()

        self.time_1 = time.time() - self.time_0
        self.cla()
        self.redraw()
        plt.draw()

    def loop(self, fps):
        while self.frame.origin.z >= 0:
            self.update()
            time.sleep(1 / fps)


def main():
    fig = plt.figure()
    ax = FreeFallPlotter(fig)
    threading.Thread(target=ax.loop, args=(6, ), daemon=True).start()
    plt.show()


if __name__ == '__main__':
    main()
