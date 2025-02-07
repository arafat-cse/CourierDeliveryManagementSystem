using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class DeliveryCharge
{
    public int DeliveryChargeId { get; set; }

    public double Weight { get; set; }

    public decimal Price { get; set; }

    public string CreateBy { get; set; } = null!;

    public DateTime CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool IsActive { get; set; }

    public int ParcelTypeId { get; set; }

    public virtual ParcelType ParcelType { get; set; } = null!;

    public virtual ICollection<Parcel> Parcels { get; set; } = new List<Parcel>();
}
