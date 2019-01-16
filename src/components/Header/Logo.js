import React from 'react'

const Logo = () => {
  return (
      <h1>
        <img src="images/obousan.gif" className="moya__h1_image moya__h1_image_first" alt="obousan"/>
        MOYAMOYA GUGUTASU
        <img src="images/samurai.gif" className="moya__h1_image moya__h1_image_last" alt="samurai"/>
      </h1>
  )
}
//MOYAMOYA GUGUTASU の文字とログイン機能（ログイン/ログアウトボタン）は別クラスにしたいね。
export default Logo