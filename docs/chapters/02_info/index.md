ESP32入門講座第2回:MH-ET LIVE MiniKit for ESP32で信号機を作ってみよう(Windows版) 
# はじめに
![信号機基板の写真](LED_traffic_board.png)

ESP32入門講座第二回は前回の告知通り、上記の写真のような信号機を制御するプログラムを書いて動かせるようになって貰います。以前のプログラミング講座で使ったようなfor文を思い出しながらコードを書いて見ましょう。

# 下準備
## 必要な部品リスト
はじめに下記の必要な部品リストに載っている機材を集めて下さい。
- Arduino IDE 2の入ったPC
- MH-ET LIVE MiniKit
- 信号機基盤
- 通信ケーブル(microB端子)

## 信号回路の確認と準備
[前回の記事](index.html?chapter=01_info)のおまけではマイコンの2番ピンをプログラムで指定して内臓のLEDを光らせていたと思います。ESP32やArduino、STMマイコンなどのマイコンには**GPIOピン**と呼ばれるピンがついています。このピンを通してマイコンはタッチセンサーや光センサーなどの入力を受け取ったり、小さいモーターやLEDに電流を流し、動かしたり、光らせたりすることが出来ます。今回は赤、黄、青のLEDをコントロールするためにGPIOピンを3つ使用します。
![信号機の回路図](LED_cycle_board.png)

信号機の回路図は上記のようになっています。実際にプログラムを書く際のLEDとGPIOピンの番号は下記の表で示したとおりです。実際にこれからプログラムを書くときの参考にして下さい。

| LEDの色 | GPIOピン番号 |
|--------|--------------|
| RED | 15 |
| YELLOW | 16 |
| BLUE | 17 |

本来であればLEDを使った回路にも抵抗を使うべきですがこの講座では回路の簡略化のために抵抗を省いています(ただ抵抗を付け忘れただけ)。今回は既に信号機用の回路の基板を作成してあるので、回路を作る必要はありません。下記の写真を参考にしながら、マイコンにユニバーサル基板を差し込んで下さい。これにて信号機の回路準備は完了です。

![信号機回路の写真](Board_image.webp)

## Arduino言語の基礎
皆さんに多少馴染みProcessingはJavaというプログラミング言語を元にしていますが、Arduino IDEで使われているArduino言語はC++が元になっているので若干書き方に違いがあります。ここではマイコンのプログラムを書くにあたって最低限知っていて欲しい二つの関数について紹介します。一つ目は初期化関数の```void setup()```です。この関数は名前の通りマイコンに電源が入ってから一度だけ呼び出される関数です。主にマイコンのGPIOピンの初期設定や各種変数の初期化などの目的で使用されます。下記のコードでsetup関数を用いてGPIOピンの2ピンを出力ピンに設定する処理を示します。

```cpp
int LED_PIN = 2;// GPIOピンの番号を指定するint型変数
void setup(){
    pinMode(LED_PIN, OUTPUT);// GPIOピンの入出力を設定する処理
}
```

二つ目はメイン処理関数の void loop() です。この関数はマイコンに電源が入っている間、繰り返し実行され続ける関数です。ロボットの動作制御やセンサーの読み取りなど、実際にやりたい処理をここに書きます。ただし「一定間隔で実行」されるわけではなく、前の処理が終わり次第すぐに次のループが始まる点に注意してください。
下記のコードで loop() 関数を用いてGPIOピン2番のLEDを1秒ごとに点滅させる処理を示します。

```cpp
int LED_PIN = 2;

void setup() {
    pinMode(LED_PIN, OUTPUT);
}

void loop() {
    digitalWrite(LED_PIN, HIGH); // LEDを点灯
    delay(1000);                 // 1秒待機
    digitalWrite(LED_PIN, LOW);  // LEDを消灯
    delay(1000);                 // 1秒待機
}
```


# 好きなLEDを光らせてみよう(レベル1)
「信号回路の確認と準備」と「Arduino言語の基礎」を参考に実際の信号機を真似て青色→黄色(点滅)→赤色のような動きを作って見ましょう。for文は使わなくて大丈夫です。

下記に完成形のコードを書きましたので、**一度自分で書いてから**に確認してみて下さい。

**ワンポイントアドバイス:**自分の書いたコードには簡単でいいので**コメント**を書くようにしよう！今回の信号機をコントロールする程度のプログラムならぱっと見で何をしているのか分かるけど、CANSATとかの中規模の開発になってくるとぱっと見で何をしている処理なのか分からなくて無駄な時間がかかってしまう。自分で書いたプログラムをその時に理解していても、一か月後には忘れているかもしれない。いまのうちから後から見返しやすいコードを書く癖をつけると今後の開発で役に立つよ！

```cpp:hide
// GPIOピンの番号を指定するint型変数
int BLUE = 17;
int YELLOW = 16;
int RED = 15;

void setup() {
  // GPIOピンを出力ピンに出力する処理
  pinMode(BLUE, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(RED, OUTPUT);
}

void loop() {
  // 青色LEDピンだけを点灯させる処理
  digitalWrite(RED, LOW);
  digitalWrite(BLUE, HIGH);
  delay(1000);
  // 黄色LEDピンだけを点滅させるする処理
  digitalWrite(BLUE, LOW);
  digitalWrite(YELLOW, HIGH);
  delay(1000);
  digitalWrite(YELLOW, LOW);
  delay(1000);
  digitalWrite(YELLOW, HIGH);
  delay(1000);
  digitalWrite(YELLOW, LOW);
  delay(1000);
  digitalWrite(YELLOW, HIGH);
  delay(1000);
  // 赤色LEDピンだけを点灯させる処理
  digitalWrite(YELLOW, LOW);
  digitalWrite(RED, HIGH);
  delay(1000);
}
```

# 信号機🚥のコードを書いてみよう(レベル2)
無事に信号機を動作させることは出来ましたね。ただ例示したコードこのままでは黄色LEDピンを点滅させる処理で同じ内容が何度も書かれていてくどいですよね。。そこでProcessing講座でも使ったfor文を使ってコードを短くしてみましょう。下記にfor文書き方を載せていますのでこれを用いてレベル1のコードを改造してみましょう。

```cpp
for(int i=0; i<=2; i++){// カッコ内の処理を3回処理
    
}
```

```cpp:hide
// GPIOピンの番号を指定するint型変数
int BLUE = 17;
int YELLOW = 16;
int RED = 15;

void setup() {
  // GPIOピンを出力ピンに出力する処理
  pinMode(BLUE, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(RED, OUTPUT);
}

void loop() {
  // 青色LEDピンだけを点灯させる処理
  digitalWrite(BLUE, HIGH);
  delay(1000);
  digitalWrite(BLUE, LOW);
  // 黄色LEDピンだけを点滅させる処理
  for(int i=0; i<=2; i++){
    digitalWrite(YELLOW, HIGH);
    delay(1000);
    digitalWrite(YELLOW, LOW);
    delay(1000);
  }
  // 赤色LEDピンだけを点灯させる処理  
  digitalWrite(RED, HIGH);
  delay(1000);
  digitalWrite(RED, LOW);

}
```
# おまけ(マイコンの仕様書を見てみよう)
今回は本講座で使用しているマイコン「MH-ET LIVE MiniKit」のピン配置の仕様書を軽く眺めて見ましょう。
![MH-ET LIVE MiniKitのピン配置](board_detail.png)

このピン配置図と配線を見ることでどのGPIOピンを有効化するべきなのか分かるようになっています。たとえばこのマイコンで内臓のLEDチップを光らせたいとしましょう。配置図をじっくり観察してみると右下の端にLED0がGPIOピンの2番ピンに繋がっていることが書かれています。