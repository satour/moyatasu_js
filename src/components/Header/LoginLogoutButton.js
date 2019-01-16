import React from 'react'

const LoginLogoutButton = ({
  login,
  logout,
  stateMe
}) => {
  return (
    <span>
      <button onClick={login} className={stateMe ? 'hidden' : undefined}>Login</button>
      <button onClick={logout} className={!stateMe ? 'hidden' : undefined}>Logout</button>
    </span>
  )
}
//MOYAMOYA GUGUTASU の文字とログイン機能（ログイン/ログアウトボタン）は別クラスにしたいね。
export default LoginLogoutButton
