namespace WebCourierAPI.Models
{
    public class BranchDTO
    {
        public int BranchId { get; set; }
        public string? BranchName { get; set; }
        public string? Address { get; set; }
        public int? ParentId { get; set; } // Parent Id send
        public List<BranchDTO>? ChildBranches { get; set; } // Recursive structure (Sub Parent)
        public bool IsActive { get; set; }
    }
}
