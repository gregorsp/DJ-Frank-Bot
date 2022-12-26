import fs = require("fs");
const sql = require("mssql");
const CONNECTIONSTRING = fs.readFileSync("./connectionstring", "utf8");

export class DatabaseHandler {
  static async getPlaylistFromDatabase(playlistId: number) {
    const QUERY = `DECLARE	@return_value int
        
          EXEC	@return_value = [dbo].[GetSongsByPlaylistId]
                  @playlistId = ${playlistId}
          
          SELECT	'Return Value' = @return_value`;
    // connect to the MSSQL database
    const pool = await sql.connect(CONNECTIONSTRING);
    // query the database
    const result = await pool.request().query(QUERY);
    // return the result
    return result.recordset;
  }
}
