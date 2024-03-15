// const cheerio = require("cheerio");
// const axios = require("axios");

// const torrent1337 = async (query, page=1) => {
//      let response = [];
//    const url = `https://www.1337xx.to/search/${query}/${page}/`;
//    try {
//       const htmlData = await axios.get(url);
//       const $ = cheerio.load(htmlData.data);
//       const links = $("td.name")
//          .map((_, element) => {
//             var link = "https://1337xx.to" + $(element).find("a").next().attr("href");
//             return link;
//          })
//          .get();

//       await Promise.all(
//          links.map(async (element) => {
//             const data = {};
//             const labels = ["Category", "Type", "Language", "Size", "UploadedBy", "Downloads", "LastChecked", "DateUploaded", "Seeders", "Leechers"];
//             let html;
//             try {
//                html = await axios.get(element);
//             } catch {
//                return null;
//             }
//             const $ = cheerio.load(html.data);
//             data.Name = $(".box-info-heading h1").text().trim();
//             data.Magnet = $(".clearfix ul li a").attr("href") || "";
//             const poster = $("div.torrent-image img").attr("src");

//             if (typeof poster !== "undefined") {
//                if (poster.startsWith("http")) {
//                   data.Poster = poster;
//                } else {
//                   data.Poster = "https:" + poster;
//                }
//             } else {
//                data.Poster = "";
//             }

//             $("div .clearfix ul li > span").each((i, element) => {
//                $list = $(element);
//                data[labels[i]] = $list.text();
//             });
//             data.Url = element;

//             response.push(data);
//          })
//       );

//       return response;
//    } catch (error) {
//       return null;
//    }
// };

// module.exports = torrent1337

/////////////////////////////////222//////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

const cheerio = require("cheerio");
const axios = require("axios");
const https = require("https");
const http = require("http");

require("dotenv").config();

const info = {
   hostname: process.env.HOST_NAME,
   port: process.env.HOST_PORT,
   userId: process.env.HOST_USERID,
   password: process.env.HOST_PASS,
};

const proxyUrl = `socks5h://${info.userId}-rotate:${info.password}@${info.hostname}:${info.port}`;

const axiosInstance = axios.create({
   proxy: false,
   httpsAgent: new https.Agent({
      proxy: proxyUrl,
   }),
   httpAgent: new http.Agent({
      proxy: proxyUrl,
   }),
});

const torrent1337 = async (query, page = 1) => {
   let response = [];
   const url = `https://www.1337x.to/search/${query}/${page}/`;
   try {
      const htmlData = await axiosInstance.get(url);
      const $ = cheerio.load(htmlData.data);
      const links = $("td.name")
         .map((_, element) => {
            var link = "https://1337x.to" + $(element).find("a").eq(1).attr("href");
            return link;
         })
         .get();

      // console.log("fdf", links);
      

      await Promise.all(
         links.map(async (element) => {
            const data = {};
            const labels = ["Category", "Type", "Language", "Size", "UploadedBy", "Downloads", "LastChecked", "DateUploaded", "Seeders", "Leechers"];
            let html;
            try {
               html = await axiosInstance.get(element);
            } catch {
               return null;
            }
            const $ = cheerio.load(html.data);
            data.Name = $(".box-info-heading h1").text().trim();
            data.Magnet = $(".clearfix ul li a").attr("href") || "";
            const poster = $("div.torrent-image img").attr("src");

            if (typeof poster !== "undefined") {
               if (poster.startsWith("http")) {
                  data.Poster = poster;
               } else {
                  data.Poster = "https:" + poster;
               }
            } else {
               data.Poster = "";
            }

            $("div .clearfix ul li > span").each((i, element) => {
               $list = $(element);
               data[labels[i]] = $list.text();
            });
            data.Url = element;
            response.push(data);
         })
      );

      return response;
   } catch (error) {
      return null;
   }
};

module.exports = torrent1337;
