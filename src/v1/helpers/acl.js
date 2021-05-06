class Acl {
    roles = {};

    rules = {
        allRoles: {
            type: 'all',

            allResources: {
                type: 'all',

                allPrivileges: {
                    type: 'all',
                    value: null,
                },

                byPrivilege: {},
            },

            byResource: {},
        },

        byRole: {},
    };

    addRole(role, parent = null) {
        if (typeof role === 'string') {
            role = String(role).trim();

            if (!this.roles[role]) {
                this.roles[role] = {
                    name: role,
                    parents: [],
                    children: [],
                };
            }

            if (parent !== null) {
                if (typeof parent === 'object') {
                    for (let i in parent) {
                        this.addRole(role, parent[i]);
                    }
                    return;
                } else if (typeof parent === 'string') {
                    parent = String(parent).trim();
                    this.addRole(parent);

                    if (!this.roles[role]['parents'].includes(parent)) {
                        this.roles[role]['parents'].push(parent);
                    }

                    if (!this.roles[parent]['children'].includes(role)) {
                        this.roles[parent]['children'].push(role);
                    }
                }
            }
        }
    }

    createNode(role = null, resource = null) {
        if (role !== null) {
            if (!this.rules['byRole'][role]) {
                this.rules['byRole'][role] = {
                    type: 'role',
                    name: role,

                    allResources: {
                        type: 'all',

                        allPrivileges: {
                            type: 'all',
                            value: null,
                        },

                        byPrivilege: {},
                    },

                    byResource: {},
                };
            }

            if (resource !== null && !this.rules['byRole'][role]['byResource'][resource]) {
                this.rules['byRole'][role]['byResource'][resource] = {
                    type: 'resource',
                    name: resource,

                    allPrivileges: {
                        type: 'all',
                        value: null,
                    },

                    byPrivilege: {},
                };
            }
        } else if (resource !== null) {
            if (!this.rules['allRoles']['byResource'][resource]) {
                this.rules['allRoles']['byResource'][resource] = {
                    type: 'resource',
                    name: resource,

                    allPrivileges: {
                        type: 'all',
                        value: null,
                    },

                    byPrivilege: {},
                };
            }
        }
    }

    setValue(role, resource, privilege, value) {
        if (role === null) {
            if (resource === null) {
                if (privilege === null) {
                    this.rules['allRoles']['allResources']['allPrivileges'] = {
                        type: 'all',
                        value: value,
                    };
                } else {
                    this.rules['allRoles']['allResources']['byPrivilege'][privilege] = {
                        type: 'privilege',
                        name: privilege,
                        value: value,
                    };
                }
            } else {
                if (privilege === null) {
                    this.rules['allRoles']['byResource'][resource]['allPrivileges'] = {
                        type: 'all',
                        value: value,
                    };
                } else {
                    this.rules['allRoles']['byResource'][resource]['byPrivilege'][privilege] = {
                        type: 'privilege',
                        name: privilege,
                        value: value,
                    };
                }
            }
        } else {
            if (resource === null) {
                if (privilege === null) {
                    this.rules['byRole'][role]['allResources']['allPrivileges'] = {
                        type: 'all',
                        value: value,
                    };
                } else {
                    this.rules['byRole'][role]['allResources']['byPrivilege'][privilege] = {
                        type: 'privilege',
                        name: privilege,
                        value: value,
                    };
                }
            } else {
                if (privilege === null) {
                    this.rules['byRole'][role]['byResource'][resource]['allPrivileges'] = {
                        type: 'all',
                        value: value,
                    };
                } else {
                    this.rules['byRole'][role]['byResource'][resource]['byPrivilege'][privilege] = {
                        type: 'privilege',
                        name: privilege,
                        value: value,
                    };
                }
            }
        }
    }

    allow(role = null, resource = null, privilege = null) {
        if (role !== null && typeof role === 'object') {
            for (let i in role) {
                this.allow(role[i], resource, privilege);
            }
            return;
        }

        if (resource !== null && typeof resource === 'object') {
            for (let i in resource) {
                this.allow(role, resource[i], privilege);
            }
            return;
        }

        if (privilege !== null && typeof privilege === 'object') {
            for (let i in privilege) {
                this.allow(role, resource, privilege[i]);
            }
            return;
        }

        this.createNode(role, resource);
        this.setValue(role, resource, privilege, 1);
    }

    deny(role = null, resource = null, privilege = null) {
        if (role !== null && typeof role === 'object') {
            for (let i in role) {
                this.deny(role[i], resource, privilege);
            }
            return;
        }

        if (resource !== null && typeof resource === 'object') {
            for (let i in resource) {
                this.deny(role, resource[i], privilege);
            }
            return;
        }

        if (privilege !== null && typeof privilege === 'object') {
            for (let i in privilege) {
                this.deny(role, resource, privilege[i]);
            }
            return;
        }

        this.createNode(role, resource);
        this.setValue(role, resource, privilege, 0);
    }

    isAllowed(role = null, resource = null, privilege = null) {
        if (role !== null && typeof role === 'object') {
            const isAllowedRole = [];
            for (let i in role) {
                isAllowedRole.push(this.isAllowed(role[i], resource, privilege));
            }
            return !!isAllowedRole.filter(row => row).length;
        } else {
            if (resource !== null && typeof resource === 'object') {
                const isAllowedResource = [];
                for (let i in resource) {
                    isAllowedResource.push(this.isAllowed(role, resource[i], privilege));
                }
                return !!isAllowedResource.filter(row => row).length;
            } else {
                if (privilege !== null && typeof privilege === 'object') {
                    const isAllowedPrivilege = [];
                    for (let i in privilege) {
                        isAllowedPrivilege.push(this.isAllowed(role, resource, privilege[i]));
                    }
                    return !!isAllowedPrivilege.filter(row => row).length;
                } else {
                    let value = null;

                    let checkOrder = [
                        ['byRole', role, 'byResource', resource, 'byPrivilege', privilege],
                        ['byRole', role, 'byResource', resource, 'allPrivileges'],
                        ['byRole', role, 'allResources', 'byPrivilege', privilege],
                        ['byRole', role, 'allResources', 'allPrivileges'],
                        ['allRoles', 'byResource', resource, 'byPrivilege', privilege],
                        ['allRoles', 'byResource', resource, 'allPrivileges'],
                        ['allRoles', 'allResources', 'byPrivilege', privilege],
                        ['allRoles', 'allResources', 'allPrivileges'],
                    ];

                    let obj = null;
                    for (var i in checkOrder) {
                        const o = checkOrder[i];

                        obj = this.rules;

                        let ok = true;
                        for (let j in o) {
                            const k = o[j];

                            if (!obj[k]) {
                                ok = false;
                                break;
                            }

                            obj = obj[k];
                        }

                        if (!ok) {
                            continue;
                        }

                        if (obj['value'] !== null) {
                            value = obj['value'];
                            break;
                        }
                    }

                    if (value !== null) {
                        return !!value;
                    }

                    if (this.roles[role]) {
                        const parents = this.roles[role]['parents'];
                        for (let i in parents) {
                            value = this.isAllowed(parents[i], resource, privilege);
                        }
                    }

                    return !!value;
                }
            }
        }
    }
}

module.exports = Acl;