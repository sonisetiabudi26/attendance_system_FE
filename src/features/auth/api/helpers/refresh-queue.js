let isRefreshing = false;

let failedQueue = [];

export function getRefreshing() {
    return isRefreshing;
}

export function setRefreshing(value) {
    isRefreshing = value;
}

export function addQueue(resolve, reject) {

    failedQueue.push({
        resolve,
        reject,
    });

}

export function processQueue(error, token = null) {

    failedQueue.forEach((promise) => {

        if (error) {

            promise.reject(error);

        } else {

            promise.resolve(token);

        }

    });

    failedQueue = [];

}