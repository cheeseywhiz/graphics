export default function dictUpdate(self, other) {
    for (let key in other) {
        self[key] = other[key];
    }

    return self;
}
