{
  description = "Development environment";

  inputs = { nixpkgs = { url = "github:NixOS/nixpkgs/nixos-unstable"; }; };

  outputs = { self, nixpkgs }:
    let
      system = builtins.currentSystem or "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.${system}.default =
        pkgs.mkShell { packages = [ pkgs.foundry ]; };
    };
}
