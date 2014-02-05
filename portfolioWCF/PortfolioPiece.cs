using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;

namespace portfolioWCF
{
    [DataContract]
    public class PortfolioPiece
    {
        [DataMember]
        public string Title { get; set; }

        [DataMember]
        public string ImgSource { get; set; }

        [DataMember]
        public string Description { get; set; }

        [DataMember]
        public string Link { get; set; }

        [DataMember]
        public string Category { get; set; }

        [DataMember]
        public string SubCategory { get; set; }

        [DataMember]
        public string Company { get; set; }

        [DataMember]
        public string Year { get; set; }

        [DataMember]
        public Guid ID { get; set; }
    }
}