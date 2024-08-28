/*global define, describe, it, expect */
define([
    'dmt-deployments/DMTDeployments'
], function (DMTDeployments) {
    'use strict';

    describe('DMTDeployments', function () {

        it('DMTDeployments should be defined', function () {
            expect(DMTDeployments).not.to.be.undefined;
        });

    });

});
