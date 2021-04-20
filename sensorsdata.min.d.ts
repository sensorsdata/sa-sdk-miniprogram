declare namespace sensors {
  function init(): void;
  function track(e: string, p?: object): void;
  function setPara (p: object): void;

  function identify(id: string, isSave?: boolean): void;
  function login(id: string): void;
  function logout(isChangeId?: boolean): void;
  function setOpenid(id: string, isCover?: boolean): void;

  function setOnceProfile(prop: object): void;
  function setProfile(prop: object): void;
  function appendProfile(prop: object): void;
  function incrementProfile(prop: object): void;

  function registerApp(prop: object): void;
  function clearAppRegister(list: Array<string>): void;
}

export default sensors;