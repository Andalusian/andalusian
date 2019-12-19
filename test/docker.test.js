const request = require('supertest');
const server = 'http://localhost:3000';
const exec = require('child_process')

describe('Docker Routes', () => {
    describe('/containerSetup', () => {
        describe('POST', () => {
            const body = {
                runtimeEnv: 'node:10',
                workDir: "/usr/app",
                runtimeCom: "npm install",
                exposePort: "3000",
                com: "['npm', 'start']",
                username: "jourdanworld",
            }
            it('responds with 200 status if passed correct information', () => {
                request(server)
                .post('/docker/containerSetup/')
                .send(body)
                .expect(200)
                // .then(response => {
                //     assert(response.body.runtimeEnv, 'node:10')
                // })
            })
            body.runtimeEnv = '';
            it('responds with 400 status if no runtime environment is given', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.runtimeEnv = '%94830';
            it('responds with 400 status if runtime environment is formatted incorrectly', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.workDir = '';
            it('responds with 400 status if no runtime environment is given', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.workDir = 'fheijf!if';
            it('responds with 400 status if runtime environment is formatted incorrectly', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.runtimeCom = '';
            it('responds with 400 status if no runtime environment is given', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.runtimeCom = 'start';
            it('responds with 400 status if runtime environment is formatted incorrectly', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.exposePort = '';
            it('responds with 400 status if no runtime environment is given', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.exposePort = 'a2345';
            it('responds with 400 status if runtime environment is formatted incorrectly', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.com = '';
            it('responds with 400 status if no runtime environment is given', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.com = '[]';
            it('responds with 400 status if runtime environment is formatted incorrectly', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.com = '';
            it('responds with 400 status if no runtime environment is given', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
            body.com = '@345';
            it('responds with 400 status if runtime environment is formatted incorrectly', () => {
                  request(server)
                  .post('/docker/containerSetup/')
                  .send(body)
                  .expect(400);
            })
        })
        exec(`rm -rfv users/${req.body.username}/docker/tmp/*;`, ['shell'], function (err, stdout, stderr) {
            console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, "| USERNAME:", `${req.body.username}`, "| dockerController.deleteContainers 2 | ", err || stdout || stderr)
        })
    })
})