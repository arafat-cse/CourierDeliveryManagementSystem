using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Company
{
    public int CompanyId { get; set; }

    public string CompanyName { get; set; } = null!;

    public string CreateBy { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public virtual ICollection<Bank> Banks { get; set; } = new List<Bank>();
}
