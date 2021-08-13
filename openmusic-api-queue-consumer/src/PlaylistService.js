const { Pool } = require('pg');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(userId) {
    const query = {
      text: `SELECT S.id, S.title, S.performer
        FROM playlistsongs as PS
        LEFT JOIN songs as S ON S.id = PS.song_id
        LEFT JOIN playlists as P ON P.id = PS.playlist_id
        LEFT JOIN collaborations ON collaborations.playlist_id = P.id
        WHERE P.owner = $1 OR collaborations.user_id = $1`,
        values: [userId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = PlaylistService;