module {
  public type CompositionId = Nat;

  public type Composition = {
    id : CompositionId;
    title : Text;
    lyrics : Text;
    audioUrl : ?Text;
    createdAt : Int;
  };

  public type CreateCompositionRequest = {
    title : Text;
    lyrics : Text;
  };
};
