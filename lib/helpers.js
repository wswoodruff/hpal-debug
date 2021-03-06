'use strict';

const Url = require('url');

const internals = {};

exports.getRouteInfo = (server, method, path, ...others) => {

    if (method && !internals.isMethod(method)) {
        path = method;
        method = null;
    }

    const id = (!method && path && path[0] !== '/') && path;

    if (id) {

        const matchOn = ['id'];
        const route = server.lookup(id);

        return {
            route,
            id,
            method: route && route.method,
            path: route && route.path,
            query: null,
            matchOn
        };
    }
    else if (path) {

        const matchOn = method ? ['method', 'path'] : ['path'];
        const { query, pathname } = Url.parse(path);
        path = pathname;
        method = (method || 'get').toLowerCase();

        const route = server.match(method, path);

        return {
            route,
            id: route && route.settings.id,
            method,
            path,
            query,
            matchOn
        };
    }

    return {
        route: null,
        id: null,
        method: null,
        path: null,
        query: null,
        matchOn: []
    };
};

internals.isMethod = (str) => {

    return ['get', 'post', 'patch', 'put', 'delete', 'options', 'head'].includes(str.toLowerCase());
};
