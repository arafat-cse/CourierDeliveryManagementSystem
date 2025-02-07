using System;
using System.Collections.Generic;

namespace WebCourierAPI.Models;

public partial class Parcel
{
    public int ParcelId { get; set; }

    public string? TrackingCode { get; set; } = null!;

    public int? SenderCustomerId { get; set; }

    public DateTime? SendTime { get; set; }

    public int? ReceiverCustomerId { get; set; }

    public DateTime? ReceiveTime { get; set; }

    public int? SenderBranchId { get; set; }

    public int? ReceiverBranchId { get; set; }

    public DateTime? EstimatedReceiveTime { get; set; }

    public bool? IsPaid { get; set; }

    public decimal? Price { get; set; }

    public double? Weight { get; set; }

    public string? CreateBy { get; set; }

    public DateTime? CreateDate { get; set; }

    public string? UpdateBy { get; set; }

    public DateTime? UpdateDate { get; set; }

    public bool? SendingBranch { get; set; }

    public bool? PercelSendingDestribution { get; set; }

    public bool? RecebingDistributin { get; set; }

    public bool? RecebingBranch { get; set; }

    public bool? RecebingReceber { get; set; }

    public bool? IsActive { get; set; }

    public int? VanId { get; set; }

    public int? DriverId { get; set; }

    public int? DeliveryChargeId { get; set; }

    public int? ParcelTypeId { get; set; }

    public string? SenderName { get; set; }

    public int? SenderPhone { get; set; }

    public string? SenderAddress { get; set; }

    public string? SenderAlternativetoAddress { get; set; }

    public string? ReceiverName { get; set; }

    public int? ReceiverPhone { get; set; }

    public string? ReceiverEmail { get; set; }

    public string? ReceiverAddress { get; set; }

    public string? ReceiverAlternativetoAddress { get; set; }

    public string? Status { get; set; }

    public virtual DeliveryCharge? DeliveryCharge { get; set; }

    public virtual ICollection<Invoice> Invoices { get; set; } = new List<Invoice>();

    public virtual ParcelType? ParcelType { get; set; }

    public virtual Branch? ReceiverBranch { get; set; }

    public virtual Receiver? ReceiverCustomer { get; set; }

    public virtual Branch? SenderBranch { get; set; }

    public virtual Customer? SenderCustomer { get; set; }

    public virtual Van? Van { get; set; }
}
