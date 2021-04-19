const index = require('../index.js');

jest.spyOn(process, 'exit').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

jest.mock('get-meta-file', () => ({
  getFileLocation: () => '/test/.meta',
}));

jest.mock('child_process', () => ({
  exec: jest.fn(
    () =>
      new Promise((resolve, reject) => {
        resolve();
      })
  ),
  execSync: jest.fn(),
}));

describe('index.js', () => {
  it('should exist', () => {
    expect(index).toBeDefined();
    expect(typeof index).toBe('function');
  });

  it('does exec and logs dirs', () => {
    const cp = require('child_process');
    const rootDir = '/test/';
    const projectPath = 'path/to/project';

    index({
      dir: `${rootDir}${projectPath}`,
      cmd: 'pwd',
    });

    expect(cp.execSync).toBeCalledWith('pwd', expect.anything());

    console.log.mock.calls.forEach((callArr) => {
      callArr.forEach((call) => {
        expect(call.includes(rootDir)).toBe(false);
        expect(call.includes(projectPath)).toBe(true);
      });
    });
  });
});
