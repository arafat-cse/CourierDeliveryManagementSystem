using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Designation
{
    public int DesignationId { get; set; }

    public string Title { get; set; } = null!;

    public string? SalaryRange { get; set; }

    public bool IsActive { get; set; }

    public string? CreateBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public virtual ICollection<Staff> Staff { get; set; } = new List<Staff>();
}
