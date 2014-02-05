using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Web;
using System.Text;
using System.Web;

namespace portfolioWCF
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in code, svc and config file together.
    // NOTE: In order to launch WCF Test Client for testing this service, please select Service1.svc or Service1.svc.cs at the Solution Explorer and start debugging.
    public class Service1 : IService1
    {
        private void GetHostingEnvironment(){
            String webServer = HttpContext.Current.Request.Url.ToString();
        }



        /// <summary>
        /// used to retrieve specific types of work
        /// </summary>
        /// <param name="category">(Web, Flash, or Design) Stuff</param>
        /// <returns>List of TitleWorks</returns>
        public List<PortfolioPiece> GetSpecificTitleWorks(string category)
        {
            GLVdevDB2DataContext context = new GLVdevDB2DataContext();
            List<PortfolioPiece> portPieces = new List<PortfolioPiece>();

            foreach (glvSQL portPiece in context.glvSQLs.Where(s => s.Category == category))
            {
                portPieces.Add(new PortfolioPiece()
                {
                    Title = portPiece.Title,
                    ImgSource = portPiece.ImgSource,
                    Description = portPiece.Description,
                    Link = portPiece.Link,
                    Category = portPiece.Category,
                    SubCategory = portPiece.SubCategory,
                    Company = portPiece.Company,
                    Year = portPiece.Year,
                    ID = portPiece.ID
                });
            }

            return portPieces;
        }


        /// <summary>
        /// These next three simplify service calls.  no need to pass parameters, 
        /// which can lead to error and other stuff...
        /// </summary>
        /// <returns>GetSpecificTitleWork({with param})</returns>
        public List<PortfolioPiece> GetAllFlashStuff()
        {
            return GetSpecificTitleWorks("Flash Stuff");
        }

        public List<PortfolioPiece> GetAllWebStuff()
        {
            return GetSpecificTitleWorks("Web Stuff");
        }

        public List<PortfolioPiece> GetAllDesignStuff()
        {
            return GetSpecificTitleWorks("Design Stuff");
        }



    }
}
