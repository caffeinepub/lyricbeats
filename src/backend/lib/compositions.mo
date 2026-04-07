import List "mo:core/List";
import Int "mo:core/Int";
import Types "../types/compositions";

module {
  public type Composition = Types.Composition;
  public type CompositionId = Types.CompositionId;
  public type CreateCompositionRequest = Types.CreateCompositionRequest;

  public func create(
    compositions : List.List<Composition>,
    nextId : Nat,
    req : CreateCompositionRequest,
    createdAt : Int,
  ) : Composition {
    let composition : Composition = {
      id = nextId;
      title = req.title;
      lyrics = req.lyrics;
      audioUrl = null;
      createdAt = createdAt;
    };
    compositions.add(composition);
    composition;
  };

  public func list(compositions : List.List<Composition>) : [Composition] {
    let arr = compositions.toArray();
    arr.sort(func(a, b) = Int.compare(b.createdAt, a.createdAt));
  };

  public func get(compositions : List.List<Composition>, id : CompositionId) : ?Composition {
    compositions.find(func(c) { c.id == id });
  };

  public func delete(compositions : List.List<Composition>, id : CompositionId) : Bool {
    let sizeBefore = compositions.size();
    let filtered = compositions.filter(func(c) { c.id != id });
    compositions.clear();
    compositions.append(filtered);
    compositions.size() < sizeBefore;
  };

  public func updateTitle(compositions : List.List<Composition>, id : CompositionId, title : Text) : Bool {
    var found = false;
    compositions.mapInPlace(
      func(c) {
        if (c.id == id) {
          found := true;
          { c with title = title };
        } else {
          c;
        };
      }
    );
    found;
  };

  public func setAudioUrl(compositions : List.List<Composition>, id : CompositionId, audioUrl : Text) : Bool {
    var found = false;
    compositions.mapInPlace(
      func(c) {
        if (c.id == id) {
          found := true;
          { c with audioUrl = ?audioUrl };
        } else {
          c;
        };
      }
    );
    found;
  };
};
