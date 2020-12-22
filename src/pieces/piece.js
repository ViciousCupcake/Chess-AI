export default class Piece {
  constructor(player, iconUrl, value) {
    this.player = player;
    this.style = { backgroundImage: "url('" + iconUrl + "')" };
    this.value = value;
  }

  getPlayer() {
    return this.player
  }
}