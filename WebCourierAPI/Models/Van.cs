using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Van
{
    public int VanId { get; set; }

    public string RegistrationNo { get; set; } = null!;

    public string? CreateBy { get; set; }

    public string? CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public virtual ICollection<Parcel> Parcels { get; set; } = new List<Parcel>();
}
