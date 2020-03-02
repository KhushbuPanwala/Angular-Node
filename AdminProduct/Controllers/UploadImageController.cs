using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace AdminProduct
{
    [Route("api/[controller]")]
    public class UploadImageController : Controller
    {
        /// <summary>
        /// Upload product image
        /// <param name="id">id of delete product detail </param>
        /// </summary>
        /// <returns>Task</returns>
        [HttpPost]
        [Route("UploadProductImage")]
        public ActionResult UploadProductImage()
        {
            try
            {

                var file = Request.Form.Files[0];
                string path = Directory.GetCurrentDirectory() + @"\ClientApp\src\assets";
                string fileName = file.FileName;
                if (file.Length > 0)
                {
                    var fullPath = Path.Combine(path, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        file.CopyTo(stream);
                    }

                    return Json(fileName);
                }
                else
                {
                    return Json("");
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
